-- Fix critical security issues by enabling RLS and creating policies

-- Enable Row Level Security on all new tables
ALTER TABLE trainer_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assigned_workouts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for trainer_clients table
CREATE POLICY "Trainers can view their client relationships" 
ON trainer_clients 
FOR SELECT 
USING (auth.uid() = trainer_id);

CREATE POLICY "Clients can view their trainer relationship" 
ON trainer_clients 
FOR SELECT 
USING (auth.uid() = client_id);

CREATE POLICY "Trainers can create client relationships" 
ON trainer_clients 
FOR INSERT 
WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "Trainers can update their client relationships" 
ON trainer_clients 
FOR UPDATE 
USING (auth.uid() = trainer_id);

CREATE POLICY "Trainers can delete their client relationships" 
ON trainer_clients 
FOR DELETE 
USING (auth.uid() = trainer_id);

-- Create RLS policies for workout_templates table
CREATE POLICY "Trainers can view their own workout templates" 
ON workout_templates 
FOR SELECT 
USING (auth.uid() = trainer_id);

CREATE POLICY "Trainers can create their own workout templates" 
ON workout_templates 
FOR INSERT 
WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "Trainers can update their own workout templates" 
ON workout_templates 
FOR UPDATE 
USING (auth.uid() = trainer_id);

CREATE POLICY "Trainers can delete their own workout templates" 
ON workout_templates 
FOR DELETE 
USING (auth.uid() = trainer_id);

-- Create RLS policies for assigned_workouts table
CREATE POLICY "Trainers can view workouts they assigned" 
ON assigned_workouts 
FOR SELECT 
USING (auth.uid() = trainer_id);

CREATE POLICY "Clients can view workouts assigned to them" 
ON assigned_workouts 
FOR SELECT 
USING (auth.uid() = client_id);

CREATE POLICY "Trainers can assign workouts to their clients" 
ON assigned_workouts 
FOR INSERT 
WITH CHECK (
  auth.uid() = trainer_id AND 
  EXISTS (
    SELECT 1 FROM trainer_clients 
    WHERE trainer_id = auth.uid() 
    AND client_id = assigned_workouts.client_id 
    AND status = 'active'
  )
);

CREATE POLICY "Trainers can update workouts they assigned" 
ON assigned_workouts 
FOR UPDATE 
USING (auth.uid() = trainer_id);

CREATE POLICY "Clients can mark workouts as completed" 
ON assigned_workouts 
FOR UPDATE 
USING (auth.uid() = client_id)
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Trainers can delete workouts they assigned" 
ON assigned_workouts 
FOR DELETE 
USING (auth.uid() = trainer_id);