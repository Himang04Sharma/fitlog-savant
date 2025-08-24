-- Restrict public access to profiles and implement least-privilege policies
-- 1) Remove overly permissive public read policy
DROP POLICY IF EXISTS "Allow users to view all profiles" ON public.profiles;

-- 2) Ensure RLS is enabled (harmless if already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3) Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- 4) Trainers can view their clients' profiles (active relationships only)
CREATE POLICY "Trainers can view their clients' profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.trainer_clients tc
    WHERE tc.client_id = profiles.id
      AND tc.trainer_id = auth.uid()
      AND tc.status = 'active'
  )
);

-- 5) Clients can view their trainer's profile (active relationships only)
CREATE POLICY "Clients can view their trainer's profile"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.trainer_clients tc
    WHERE tc.trainer_id = profiles.id
      AND tc.client_id = auth.uid()
      AND tc.status = 'active'
  )
);