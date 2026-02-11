"use server"

import { createClient } from "@/utils/supabase/server.supabase"
import { cookies } from "next/headers"

export async function savePushSubscription(subscription: PushSubscriptionJSON) {
    const supabase = createClient(cookies())
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { endpoint, keys } = subscription

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
        throw new Error("Invalid subscription data")
    }

    const { error } = await supabase.from('push_subscriptions').upsert({
        owner: user.id,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth
    }, {
        onConflict: 'owner,endpoint'
    })

    if (error) {
        console.error('Error saving push subscription:', error)
        throw new Error("Failed to save push subscription")
    }

    return { success: true }
}

export async function deletePushSubscription(endpoint: string) {
    const supabase = createClient(cookies())
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('owner', user.id)
        .eq('endpoint', endpoint)

    if (error) {
        console.error('Error deleting push subscription:', error)
        throw new Error("Failed to delete push subscription")
    }

    return { success: true }
}

export async function getPushSubscriptions() {
    const supabase = createClient(cookies())
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('owner', user.id)

    if (error) {
        console.error('Error fetching push subscriptions:', error)
        return []
    }

    return data
}
