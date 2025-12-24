# Video App Setup Guide

## Step 1: Run Database Migration

1. Go to your Supabase project: https://oawajwlqblmohnbihgdo.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `supabase/migrations/001_create_videos_schema.sql`
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

This will create:
- `videos` table with 8 sample videos
- `video_views` table for tracking views
- `record_video_view` function for counting views

## Step 2: Get Your API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://oawajwlqblmohnbihgdo.supabase.co`
   - **anon/public key**: (the long JWT token under "Project API keys")

## Step 3: Create Environment File

Create a file named `.env.local` in the root of your project with:

```
NEXT_PUBLIC_SUPABASE_URL=https://oawajwlqblmohnbihgdo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_anon_key_here` with the actual anon key from Step 2.

## Step 4: Start the App

```bash
npm run dev
```

Open http://localhost:3000 and you should see your video grid!

## Troubleshooting

- **No videos showing?** Make sure the SQL migration ran successfully
- **API errors?** Double-check your `.env.local` file has the correct keys
- **View counting not working?** Check the browser console for errors

