import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Initialize Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Get VAPID keys from environment
        const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
        const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')
        const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:support@billflow.app'

        if (!vapidPublicKey || !vapidPrivateKey) {
            throw new Error('VAPID keys not configured')
        }

        // Get all overdue unpaid bills
        const today = new Date().toISOString().split('T')[0]
        const { data: overdueBills, error: billsError } = await supabaseClient
            .from('bills')
            .select('id, merchant_name, amount, due_date, owner')
            .eq('is_paid', false)
            .eq('is_deleted', false)
            .lt('due_date', today)

        if (billsError) throw billsError

        console.log(`Found ${overdueBills?.length || 0} overdue bills`)

        let notificationsSent = 0

        // Process each overdue bill
        for (const bill of overdueBills || []) {
            // Check if notification was sent in the last 24 hours
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            const { data: recentLogs } = await supabaseClient
                .from('notification_logs')
                .select('id')
                .eq('bill_id', bill.id)
                .eq('owner', bill.owner)
                .gte('sent_at', twentyFourHoursAgo)
                .limit(1)

            if (recentLogs && recentLogs.length > 0) {
                console.log(`Skipping bill ${bill.id} - notification sent recently`)
                continue
            }

            // Get user's push subscriptions
            const { data: subscriptions } = await supabaseClient
                .from('push_subscriptions')
                .select('*')
                .eq('owner', bill.owner)

            if (!subscriptions || subscriptions.length === 0) {
                console.log(`No subscriptions found for user ${bill.owner}`)
                continue
            }

            // Prepare notification payload
            const payload = JSON.stringify({
                title: '⚠️ Bill Overdue',
                body: `${bill.merchant_name} - ₹${bill.amount} was due on ${new Date(bill.due_date).toLocaleDateString()}`,
                billId: bill.id,
                url: `/dashboard/bills/${bill.id}`,
                tag: `bill-${bill.id}`
            })

            // Send push notification to all user's subscriptions
            for (const subscription of subscriptions) {
                try {
                    const pushSubscription = {
                        endpoint: subscription.endpoint,
                        keys: {
                            p256dh: subscription.p256dh,
                            auth: subscription.auth
                        }
                    }

                    // Use web-push library (you'll need to import this)
                    const webpush = await import('https://esm.sh/web-push@3.6.6')

                    webpush.setVapidDetails(
                        vapidSubject,
                        vapidPublicKey,
                        vapidPrivateKey
                    )

                    await webpush.sendNotification(pushSubscription, payload)
                    console.log(`Sent notification for bill ${bill.id} to subscription ${subscription.id}`)
                } catch (error) {
                    console.error(`Failed to send to subscription ${subscription.id}:`, error)

                    // If subscription is invalid, delete it
                    if (error.statusCode === 410 || error.statusCode === 404) {
                        await supabaseClient
                            .from('push_subscriptions')
                            .delete()
                            .eq('id', subscription.id)
                    }
                }
            }

            // Create notification record in database
            await supabaseClient.from('notifications').insert({
                owner: bill.owner,
                title: '⚠️ Bill Overdue',
                body: `${bill.merchant_name} - ₹${bill.amount} was due on ${new Date(bill.due_date).toLocaleDateString()}`,
                type: 'overdue',
                bill: bill.id,
                is_read: false
            })

            // Log notification send
            await supabaseClient.from('notification_logs').insert({
                bill_id: bill.id,
                owner: bill.owner,
                notification_type: 'overdue_reminder'
            })

            notificationsSent++
        }

        return new Response(
            JSON.stringify({
                success: true,
                overdueBills: overdueBills?.length || 0,
                notificationsSent
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
            }
        )
    }
})
