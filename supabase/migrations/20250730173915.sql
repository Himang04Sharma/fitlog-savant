-- Improve database schema with suggested enhancements

-- Create difficulty level enum
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Update profiles table with proper constraints and audit fields
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_trainer_id_fkey,
ADD CONSTRAINT profiles_trainer_id_fkey 
  FOREIGN KEY (trainer_id) REFERENCES profiles(id) ON DELETE SET NULL,
ALTER COLUMN phone TYPE varchar(15),
ADD COLUMN updated_at timestamp with time zone DEFAULT now();

-- Update trainer_clients table with proper constraints and audit fields
ALTER TABLE trainer_clients 
DROP CONSTRAINT IF EXISTS trainer_clients_trainer_id_fkey,
DROP CONSTRAINT IF EXISTS trainer_clients_client_id_fkey,
ADD CONSTRAINT trainer_clients_trainer_id_fkey 
  FOREIGN KEY (trainer_id) REFERENCES profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT trainer_clients_client_id_fkey 
  FOREIGN KEY (client_id) REFERENCES profiles(id) ON DELETE CASCADE,
ADD COLUMN updated_at timestamp with time zone DEFAULT now();

-- Update workout_templates table with proper constraints and difficulty enum
ALTER TABLE workout_templates 
DROP CONSTRAINT IF EXISTS workout_templates_trainer_id_fkey,
ADD CONSTRAINT workout_templates_trainer_id_fkey 
  FOREIGN KEY (trainer_id) REFERENCES profiles(id) ON DELETE CASCADE,
ALTER COLUMN difficulty_level TYPE difficulty_level USING difficulty_level::difficulty_level,
ADD COLUMN updated_at timestamp with time zone DEFAULT now();

-- Rename client_workout_assignments to assigned_workouts for brevity
ALTER TABLE client_workout_assignments RENAME TO assigned_workouts;

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
ADD COLUMN updated_at timestamp with time zone DEFAULT now();

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_trainer_clients_trainer_id ON trainer_clients (trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_clients_client_id ON trainer_clients (client_id);
CREATE INDEX IF NOT EXISTS idx_assigned_workouts_assigned_date ON assigned_workouts (assigned_date);
CREATE INDEX IF NOT EXISTS idx_assigned_workouts_client_id ON assigned_workouts (client_id);
CREATE INDEX IF NOT EXISTS idx_workout_templates_trainer_id ON workout_templates (trainer_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainer_clients_updated_at
  BEFORE UPDATE ON trainer_clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_templates_updated_at
  BEFORE UPDATE ON workout_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assigned_workouts_updated_at
  BEFORE UPDATE ON assigned_workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();