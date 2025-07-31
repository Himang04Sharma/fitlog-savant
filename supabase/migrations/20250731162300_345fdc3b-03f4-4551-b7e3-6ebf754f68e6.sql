-- Complete trainer system implementation with improvements

-- Step 1: Create all required types
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
    CREATE TYPE user_type AS ENUM ('normal_user', 'trainer');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_level') THEN
    CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
  END IF;
END $$;

-- Step 2: Add columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS user_type user_type DEFAULT 'normal_user',
ADD COLUMN IF NOT EXISTS trainer_id uuid,
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS phone varchar(15),
ADD COLUMN IF NOT EXISTS specialization text,
ADD COLUMN IF NOT EXISTS certification text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Step 3: Create trainer_clients table
CREATE TABLE IF NOT EXISTS trainer_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid NOT NULL,
  client_id uuid NOT NULL,
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(trainer_id, client_id)
);

-- Step 4: Create workout_templates table
CREATE TABLE IF NOT EXISTS workout_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  exercises jsonb NOT NULL,
  difficulty_level difficulty_level DEFAULT 'beginner',
  duration_minutes integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Step 5: Create assigned_workouts table
CREATE TABLE IF NOT EXISTS assigned_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid NOT NULL,
  client_id uuid NOT NULL,
  workout_template_id uuid,
  assigned_date date NOT NULL,
  completed boolean DEFAULT false,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Step 6: Add foreign key constraints with proper ON DELETE behavior
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_trainer_id_fkey,
ADD CONSTRAINT profiles_trainer_id_fkey 
  FOREIGN KEY (trainer_id) REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE trainer_clients 
ADD CONSTRAINT trainer_clients_trainer_id_fkey 
  FOREIGN KEY (trainer_id) REFERENCES profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT trainer_clients_client_id_fkey 
  FOREIGN KEY (client_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE workout_templates 
ADD CONSTRAINT workout_templates_trainer_id_fkey 
  FOREIGN KEY (trainer_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE assigned_workouts 
ADD CONSTRAINT assigned_workouts_trainer_id_fkey 
  FOREIGN KEY (trainer_id) REFERENCES profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT assigned_workouts_client_id_fkey 
  FOREIGN KEY (client_id) REFERENCES profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT assigned_workouts_workout_template_id_fkey 
  FOREIGN KEY (workout_template_id) REFERENCES workout_templates(id) ON DELETE CASCADE;

-- Step 7: Create performance indexes
CREATE INDEX IF NOT EXISTS idx_trainer_clients_trainer_id ON trainer_clients (trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_clients_client_id ON trainer_clients (client_id);
CREATE INDEX IF NOT EXISTS idx_assigned_workouts_assigned_date ON assigned_workouts (assigned_date);
CREATE INDEX IF NOT EXISTS idx_assigned_workouts_client_id ON assigned_workouts (client_id);
CREATE INDEX IF NOT EXISTS idx_workout_templates_trainer_id ON workout_templates (trainer_id);

-- Step 8: Create triggers for updated_at timestamps
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trainer_clients_updated_at ON trainer_clients;
CREATE TRIGGER update_trainer_clients_updated_at
  BEFORE UPDATE ON trainer_clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workout_templates_updated_at ON workout_templates;
CREATE TRIGGER update_workout_templates_updated_at
  BEFORE UPDATE ON workout_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assigned_workouts_updated_at ON assigned_workouts;
CREATE TRIGGER update_assigned_workouts_updated_at
  BEFORE UPDATE ON assigned_workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();