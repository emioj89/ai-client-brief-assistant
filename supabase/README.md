# Supabase Setup Guide for AI Client Brief Assistant

Follow these steps to configure the Supabase backend and Edge Function for AI Client Brief Assistant:

## 1. Database & Schema Setup

1. Create a project at [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository, copy its contents, paste them into the SQL Editor, and click **Run**.

## 2. Frontend Configuration

1. In your Supabase dashboard, go to **Project Settings** -> **API**.
2. Copy your **Project URL** and **Publishable Key**.
3. Create a `.env.local` file in the root directory of the frontend project:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

## 3. Edge Function Deployment

1. Install the Supabase CLI locally or login via CLI:
   ```bash
   npx supabase login
   npx supabase link --project-ref your-project-ref
   ```
2. Deploy the `analyze-brief` Edge Function:
   ```bash
   npx supabase functions deploy analyze-brief --no-verify-jwt
   ```

## 4. Edge Function Secrets

Set secrets in Supabase for the `analyze-brief` function so it can securely invoke an OpenAI-compatible API provider without exposing API keys to the frontend:

```bash
npx supabase secrets set AI_API_URL="https://api.openai.com/v1/chat/completions"
npx supabase secrets set AI_API_KEY="your-openai-or-groq-or-openrouter-api-key"
npx supabase secrets set AI_MODEL="gpt-4o-mini"
```

*(Note: Secrets are accessible exclusively by the serverless Edge Function).*

