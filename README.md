AIRKINGS

## Quick start

1) Install dependencies

- npm install

2) Environment variables

Create `.env.local` in the project root with:
- VITE_SUPABASE_URL=https://colcmjjbbsgantouckrt.supabase.co
- VITE_SUPABASE_ANON_KEY=sb_publishable_AAFhV_P-wj1adj02T9MGag_2spVpAaK

Note:
- Use the Supabase “Publishable key” (sb_publishable_...) from Settings → API Keys. Do not use the secret key in the browser.
- Restart the dev server after changing env vars.

3) Initialize Supabase (new project)

Run these SQL files in Supabase SQL Editor in order:
- supabase/migrations/20250915063408_quick_limit.sql
- supabase/migrations/20250918125534_snowy_shape.sql
- supabase/migrations/20250923094500_add_sort_order.sql

4) Create an admin user

Supabase Dashboard → Authentication → Users → Add a user (email/password) → Confirm email if needed.

5) Start the dev server

- npm run dev
- Admin dashboard: http://localhost:5173/admin
- Website: http://localhost:5173/

6) Test reordering

- Create 2–3 jobs in Admin.
- Drag the ⋮ handle to reorder; a “Saving new order...” toast appears.
- Refresh; order persists and matches on the public site.

Notes:
- If uploads fail, verify the `airkings-media` bucket exists and is public (created by the migration).
- If you see RLS errors, ensure you are authenticated in the Admin dashboard.
- Vite requires env vars to be prefixed with `VITE_` to be exposed to the client.
- If you see RLS errors, ensure you are authenticated in the Admin dashboard.
- Vite requires env vars to be prefixed with `VITE_` to be exposed to the client.

Troubleshooting:
- Ensure VITE_SUPABASE_ANON_KEY is the Publishable key (sb_publishable_...), not the secret.
- Open browser console; you should see either “Legacy key prefix=…” or “New key prefix=…”.
- If you get 401 Invalid API key, re-copy the Publishable key from Settings → API Keys and ensure the URL matches the same project.
- Create .env.local with:
  - VITE_SUPABASE_URL=https://colcmjjbbsgantouckrt.supabase.co
  - VITE_SUPABASE_ANON_KEY=<your anon key from Project Settings → API (Anon public)>
- Restart the dev server after changing env vars.
- Open browser console; you should see: “[Supabase] Using URL=… | Key prefix=… | Ref=…”.
- If you see “Project ref mismatch”, the URL and key are from different projects.
  - Re-copy the Anon public key from Supabase: Settings → API → Project API keys.
  - Ensure the key’s JWT payload “ref” matches the project ref in your URL.
  - Verify the project is active (not paused) and you’re using the “anon public” key (not a revoked/rotated one).
- Ensure the email/password user exists in Supabase Auth and the email is confirmed (if confirmations are enabled).
