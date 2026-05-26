# Robarol Monolith

Monolith workspace for the Robarol frontend and Supabase-backed backend.

## Structure

- `client/` React + Vite frontend
- `server/` Express API for auth, listings, uploads, and inquiries
- `shared/` shared contracts used by client and server
- `supabase/` SQL migration for the initial schema and policies

## Setup

1. Install dependencies:
   - `npm install --workspaces`
2. Copy env files:
   - `client/.env.example` to `client/.env`
   - `server/.env.example` to `server/.env`
3. Apply the SQL in `supabase/migrations/20260526000000_initial_schema.sql` to your Supabase project.
4. Create at least one Supabase Auth user and add that user id to `public.admin_users`.

## Commands

- `npm run dev`
- `npm run build`
- `npm run seed`
