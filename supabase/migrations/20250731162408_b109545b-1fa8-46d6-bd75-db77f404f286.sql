-- Fix function search path security warnings

-- Update handle_new_user function with secure search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.email);
  RETURN new;
END;
$function$;

-- Update update_updated_at_column function with secure search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;