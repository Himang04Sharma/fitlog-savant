// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mydpfvrurwllgwjfzzot.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZHBmdnJ1cndsbGd3amZ6em90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NDEwMzYsImV4cCI6MjA1NjIxNzAzNn0.00MpYfBVx3ZAnfNYVodkDS4rO8IWqIfqjw53pOqCRfs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);