# Send Overdue Notifications Edge Function

This Edge Function sends push notifications for overdue bills every 24 hours.

## Setup

1. Deploy the function:
```bash
supabase functions deploy send-overdue-notifications
```

2. Set environment secrets:
```bash
# Generate VAPID keys first
npx web-push generate-vapid-keys

# Set the secrets
supabase secrets set VAPID_PUBLIC_KEY="your_public_key"
supabase secrets set VAPID_PRIVATE_KEY="your_private_key"
supabase secrets set VAPID_SUBJECT="mailto:your-email@example.com"
```

3. Test the function:
```bash
curl -i --location --request POST 'https://your-project.supabase.co/functions/v1/send-overdue-notifications' \
  --header 'Authorization: Bearer YOUR_ANON_KEY'
```

## How it works

1. Fetches all unpaid bills with due_date < today
2. For each bill, checks if notification was sent in last 24 hours
3. If not, fetches user's push subscriptions
4. Sends push notification via Web Push API
5. Creates notification record in database
6. Logs the send in notification_logs table
