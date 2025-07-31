-- Step 1: Create all required types first
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

-- Step 2: Add missing columns to profiles table
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

-- Step 3: Update workout_templates difficulty_level to use enum
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

-- Step 4: Add updated_at columns to all tables
ALTER TABLE trainer_clients ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();
ALTER TABLE workout_templates ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Step 5: Rename client_workout_assignments to assigned_workouts for brevity
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_workout_assignments') THEN
    ALTER TABLE client_workout_assignments RENAME TO assigned_workouts;
  END IF;
END $$;

-- Step 6: Add updated_at to assigned_workouts
ALTER TABLE assigned_workouts ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();