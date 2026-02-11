# Testing the Edge Function

## Issue: Invalid JWT Error

The error `{"code":401,"message":"Invalid JWT"}` occurs because you're using the **publishable key** instead of the **anon key**.

## Solution: Get the Correct Anon Key

### Step 1: Get Your Anon Key
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **anon** **public** key (it starts with `eyJ...`)

### Step 2: Test the Edge Function

Replace `YOUR_ANON_KEY` with the key from Step 1:

```bash
curl -L -X POST 'https://tscjuifbsszxljlvjzun.supabase.co/functions/v1/send-overdue-notifications' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

## Alternative: Test Without Authentication (Development Only)

If you want to test without authentication during development, you can modify the Edge Function to skip auth checks:

**Update `supabase/functions/send-overdue-notifications/index.ts`:**

Add this at the top of the serve function:
```typescript
// Skip auth check for testing (REMOVE IN PRODUCTION)
if (req.headers.get('x-test-mode') === 'true') {
  // ... run function logic
}
```

Then test with:
```bash
curl -L -X POST 'https://tscjuifbsszxljlvjzun.supabase.co/functions/v1/send-overdue-notifications' \
  -H 'x-test-mode: true'
```

## Expected Success Response

When working correctly, you should see:
```json
{
  "success": true,
  "overdueBills": 0,
  "notificationsSent": 0
}
```

## Troubleshooting

### Still getting 401?
- Make sure you copied the **anon** key, not the publishable key
- The anon key should be very long (starts with `eyJ`)
- Check that the Edge Function is deployed: `supabase functions list`

### Getting other errors?
- Check Edge Function logs: `supabase functions logs send-overdue-notifications`
- Verify environment secrets are set: `supabase secrets list`
- Ensure database tables exist (run SQL from DATABASE_SETUP.md)
