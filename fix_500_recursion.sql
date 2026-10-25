-- Fix for 500 Error: RLS Infinite Recursion on the users table
-- By adding SECURITY DEFINER, this function will bypass RLS when looking up the role,
-- preventing the infinite loop when evaluating policies on the public.users table.

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;
