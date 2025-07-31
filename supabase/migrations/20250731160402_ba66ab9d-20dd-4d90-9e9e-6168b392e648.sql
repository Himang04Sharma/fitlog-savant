-- Improve database schema with suggested enhancements (syntax fixed)

-- Create difficulty level enum (PostgreSQL doesn't support IF NOT EXISTS for types)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_level') THEN
    CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
  END IF;
END $$;

-- Add missing columns to profiles table first
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone varchar(15),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Update profiles table with proper constraints
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_trainer_id_fkey,
ADD CONSTRAINT profiles_trainer_id_fkey 
  FOREIGN KEY (trainer_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- Update trainer_clients table with proper constraints and audit fields
ALTER TABLE trainer_clients 
DROP CONSTRAINT IF EXISTS trainer_clients_trainer_id_fkey,
DROP CONSTRAINT IF EXISTS trainer_clients_client_id_fkey,
ADD CONSTRAINT trainer_clients_trainer_id_fkey 
  FOREIGN KEY (trainer_id) REFERENCES profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT trainer_clients_client_id_fkey 
  FOREIGN KEY (client_id) REFERENCES profiles(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Update workout_templates table with proper constraints and difficulty enum
ALTER TABLE workout_templates 
DROP CONSTRAINT IF EXISTS workout_templates_trainer_id_fkey,
ADD CONSTRAINT workout_templates_trainer_id_fkey 
  FOREIGN KEY (trainer_id) REFERENCES profiles(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Update difficulty_level column to use enum (only if it's text currently)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'workout_templates' 
             AND column_name = 'difficulty_level' 
             AND data_type = 'text') THEN
    ALTER TABLE workout_templates 
    ALTER COLUMN difficulty_level TYPE difficulty_level 
    USING CASE 
      WHEN difficulty_level IN ('beginner', 'intermediate', 'advanced') 
      THEN difficulty_level::difficulty_level 
      ELSE 'beginner'::difficulty_level 
    END;
  END IF;
END $$;

-- Rename client_workout_assignments to assigned_workouts for brevity
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_workout_assignments') THEN
    ALTER TABLE client_workout_assignments RENAME TO assigned_workouts;
  END IF;
END $$;

-- Update assigned_workouts table with proper constraints and audit fields
ALTER TABLE assigned_workouts 
DROP CONSTRAINT IF EXISTS client_workout_assignments_trainer_id_fkey,
DROP CONSTRAINT IF EXISTS client_workout_assignments_client_id_fkey,
DROP CONSTRAINT IF EXISTS client_workout_assignments_workout_template_id_fkey,
ADD CONSTRAINT assigned_workouts_trainer_id_fkey 
  FOREIGN KEY (trainer_id) REFERENCES profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT assigned_workouts_client_id_fkey 
  FOREIGN KEY (client_id) REFERENCES profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT assigned_workouts_workout_template_id_fkey 
  FOREIGN KEY (workout_template_id) REFERENCES workout_templates(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_trainer_clients_trainer_id ON trainer_clients (trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_clients_client_id ON trainer_clients (client_id);
CREATE INDEX IF NOT EXISTS idx_assigned_workouts_assigned_date ON assigned_workouts (assigned_date);
CREATE INDEX IF NOT EXISTS idx_assigned_workouts_client_id ON assigned_workouts (client_id);
CREATE INDEX IF NOT EXISTS idx_workout_templates_trainer_id ON workout_templates (trainer_id);

-- Create triggers for updated_at timestamps
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