# Database Setup for Push Notifications

Run these SQL commands in your Supabase SQL Editor:

## 1. Create push_subscriptions table

```sql
CREATE TABLE push_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    owner UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(owner, endpoint)
);

-- Enable RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can manage their own subscriptions
CREATE POLICY "Users can manage their own subscriptions"
ON push_subscriptions
FOR ALL
TO authenticated
USING (auth.uid() = owner)
WITH CHECK (auth.uid() = owner);
```

## 2. Create notification_logs table

```sql
CREATE TABLE notification_logs (
    id BIGSERIAL PRIMARY KEY,
    bill_id BIGINT REFERENCES bills(id) ON DELETE CASCADE,
    owner UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sent_at TIMESTAMP DEFAULT NOW(),
    notification_type TEXT DEFAULT 'overdue_reminder'
);

-- Enable RLS
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own logs
CREATE POLICY "Users can view their own notification logs"
ON notification_logs
FOR SELECT
TO authenticated
USING (auth.uid() = owner);
```

## 3. Update notifications table (if needed)

```sql
-- Add columns if they don't exist
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS bill BIGINT REFERENCES bills(id);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;
```

## 4. Setup Cron Job

Go to Supabase Dashboard → Database → Cron Jobs, or run:

```sql
SELECT cron.schedule(
    'send-overdue-notifications',
    '0 9 * * *', -- Every day at 9 AM
    $$
    SELECT net.http_post(
        url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-overdue-notifications',
        headers := jsonb_build_object('Authorization', 'Bearer YOUR_ANON_KEY')
    );
    $$
);
```

Replace:
- `YOUR_PROJECT_REF` with your Supabase project reference
- `YOUR_ANON_KEY` with your Supabase anon key

## 5. Generate VAPID Keys

```bash
npx web-push generate-vapid-keys
```

Add the public key to `.env.local`:
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
```

Add both keys to Supabase Edge Function secrets:
```bash
supabase secrets set VAPID_PUBLIC_KEY="your_public_key"
supabase secrets set VAPID_PRIVATE_KEY="your_private_key"
supabase secrets set VAPID_SUBJECT="mailto:your-email@example.com"
```

## Verification

1. Check tables exist:
```sql
SELECT * FROM push_subscriptions LIMIT 1;
SELECT * FROM notification_logs LIMIT 1;
```

2. Test Edge Function manually:
```bash
curl -i --location --request POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-overdue-notifications' \
  --header 'Authorization: Bearer YOUR_ANON_KEY'
```

3. Check cron job is scheduled:
```sql
SELECT * FROM cron.job WHERE jobname = 'send-overdue-notifications';
```
