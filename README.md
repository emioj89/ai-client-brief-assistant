# AI Client Brief Assistant

A lightweight SaaS tool built with React, TypeScript, and Supabase that transforms raw client project requests into structured technical briefs using AI-powered analysis.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, React Router (`HashRouter`)
- **Backend**: Supabase Auth, PostgreSQL, Row Level Security (RLS)
- **AI Integration**: Supabase Edge Function (`analyze-brief`) with OpenAI-compatible API abstraction
- **Testing**: Vitest

## Status
MVP implementation complete. Demonstrates secure architecture where AI API keys and prompts are executed strictly server-side inside Supabase Edge Functions, keeping client-side dependencies light and secure.

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to `.env.local`.

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Run tests:
   ```bash
   npm run test
   ```
