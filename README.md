## Junospace monorepo

### Projects
- edtech-admin — Admin portal (React + Vite + Supabase)
- edtech-instructor — Instructor portal (React + Vite + Supabase)
- ed-tech-student — Student portal (React + Vite + Supabase)

### Shared packages
- @junospace/ui — shared UI components
- @junospace/supabase-client — shared Supabase singleton client

### Setup
npm install (from root)
Each portal: copy .env.example to .env and fill in Supabase keys
npm run dev (from each portal folder)
