
-- 1. Re-attach handle_new_user trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Security definer helper: is there an active trainer<->client link between two users?
CREATE OR REPLACE FUNCTION public.has_trainer_client_link(_a uuid, _b uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.trainer_clients
    WHERE status = 'active'
      AND ((trainer_id = _a AND client_id = _b)
        OR (trainer_id = _b AND client_id = _a))
  );
$$;

-- 3. Harden profiles SELECT
DROP POLICY IF EXISTS "Allow users to view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Trainers and clients can view linked profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Trainers and clients can view linked profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_trainer_client_link(auth.uid(), id));

-- 4. Dedupe diet_logs policies
DROP POLICY IF EXISTS "Allow users to delete their own diet logs" ON public.diet_logs;
DROP POLICY IF EXISTS "Allow users to insert their own diet logs" ON public.diet_logs;
DROP POLICY IF EXISTS "Allow users to update their own diet logs" ON public.diet_logs;
DROP POLICY IF EXISTS "Allow users to view their own diet logs" ON public.diet_logs;
DROP POLICY IF EXISTS "Users can delete their own diet logs" ON public.diet_logs;
DROP POLICY IF EXISTS "Users can insert their own diet logs" ON public.diet_logs;
DROP POLICY IF EXISTS "Users can only view their own diet logs" ON public.diet_logs;
DROP POLICY IF EXISTS "Users can update their own diet logs" ON public.diet_logs;
DROP POLICY IF EXISTS "Users can view their own diet logs" ON public.diet_logs;
DROP POLICY IF EXISTS "diet_logs_delete_policy" ON public.diet_logs;
DROP POLICY IF EXISTS "diet_logs_insert_policy" ON public.diet_logs;
DROP POLICY IF EXISTS "diet_logs_select_policy" ON public.diet_logs;
DROP POLICY IF EXISTS "diet_logs_update_policy" ON public.diet_logs;

CREATE POLICY "Users can view their own diet logs"
  ON public.diet_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own diet logs"
  ON public.diet_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own diet logs"
  ON public.diet_logs FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own diet logs"
  ON public.diet_logs FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 5. Dedupe workout_logs policies
DROP POLICY IF EXISTS "Allow users to delete their own workout logs" ON public.workout_logs;
DROP POLICY IF EXISTS "Allow users to insert their own workout logs" ON public.workout_logs;
DROP POLICY IF EXISTS "Allow users to update their own workout logs" ON public.workout_logs;
DROP POLICY IF EXISTS "Allow users to view their own workout logs" ON public.workout_logs;
DROP POLICY IF EXISTS "Users can delete their own workout logs" ON public.workout_logs;
DROP POLICY IF EXISTS "Users can insert their own workout logs" ON public.workout_logs;
DROP POLICY IF EXISTS "Users can only view their own workout logs" ON public.workout_logs;
DROP POLICY IF EXISTS "Users can update their own workout logs" ON public.workout_logs;
DROP POLICY IF EXISTS "Users can view their own workout logs" ON public.workout_logs;
DROP POLICY IF EXISTS "workout_logs_delete_policy" ON public.workout_logs;
DROP POLICY IF EXISTS "workout_logs_insert_policy" ON public.workout_logs;
DROP POLICY IF EXISTS "workout_logs_select_policy" ON public.workout_logs;
DROP POLICY IF EXISTS "workout_logs_update_policy" ON public.workout_logs;

CREATE POLICY "Users can view their own workout logs"
  ON public.workout_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own workout logs"
  ON public.workout_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own workout logs"
  ON public.workout_logs FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own workout logs"
  ON public.workout_logs FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
