
-- 1. Prevent user_type self-escalation via API
CREATE OR REPLACE FUNCTION public.prevent_user_type_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_type IS DISTINCT FROM OLD.user_type THEN
    RAISE EXCEPTION 'Changing user_type is not allowed';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_user_type_change_trg ON public.profiles;
CREATE TRIGGER prevent_user_type_change_trg
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_user_type_change();

-- 2. Helper: is caller a trainer?
CREATE OR REPLACE FUNCTION public.is_trainer(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND user_type = 'trainer'
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_trainer(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_trainer_client_link(uuid, uuid) FROM PUBLIC, anon, authenticated;

-- 3. Restrict trainer_clients INSERT to actual trainers
DROP POLICY IF EXISTS "Trainers can create client relationships" ON public.trainer_clients;
CREATE POLICY "Trainers can create client relationships"
  ON public.trainer_clients FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = trainer_id
    AND public.is_trainer(auth.uid())
  );

-- 4. Remove profiles from realtime publication (no-op if not present)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'profiles'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.profiles';
  END IF;
END $$;
