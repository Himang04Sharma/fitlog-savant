export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      daily_logs: {
        Row: {
          breakfast: string | null
          created_at: string | null
          dinner: string | null
          goals: string[] | null
          id: string
          log_date: string
          lunch: string | null
          macros_calories: number | null
          macros_carbs: number | null
          macros_fat: number | null
          macros_protein: number | null
          muscle_groups_trained: string[] | null
          snacks: string | null
          steps: number | null
          updated_at: string | null
          user_id: string
          water_intake: number | null
          weight: number | null
        }
        Insert: {
          breakfast?: string | null
          created_at?: string | null
          dinner?: string | null
          goals?: string[] | null
          id?: string
          log_date: string
          lunch?: string | null
          macros_calories?: number | null
          macros_carbs?: number | null
          macros_fat?: number | null
          macros_protein?: number | null
          muscle_groups_trained?: string[] | null
          snacks?: string | null
          steps?: number | null
          updated_at?: string | null
          user_id: string
          water_intake?: number | null
          weight?: number | null
        }
        Update: {
          breakfast?: string | null
          created_at?: string | null
          dinner?: string | null
          goals?: string[] | null
          id?: string
          log_date?: string
          lunch?: string | null
          macros_calories?: number | null
          macros_carbs?: number | null
          macros_fat?: number | null
          macros_protein?: number | null
          muscle_groups_trained?: string[] | null
          snacks?: string | null
          steps?: number | null
          updated_at?: string | null
          user_id?: string
          water_intake?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      diet_logs: {
        Row: {
          created_at: string | null
          date: string
          id: string
          meals: Json
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          meals: Json
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          meals?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diet_logs_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      workout_logs: {
        Row: {
          created_at: string | null
          date: string
          exercises: Json
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          exercises: Json
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          exercises?: Json
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_logs_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          created_at: string | null
          daily_log_id: string
          exercise_name: string | null
          id: string
          muscle_group: string | null
          reps: string | null
          sets: number | null
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          daily_log_id: string
          exercise_name?: string | null
          id?: string
          muscle_group?: string | null
          reps?: string | null
          sets?: number | null
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          daily_log_id?: string
          exercise_name?: string | null
          id?: string
          muscle_group?: string | null
          reps?: string | null
          sets?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workouts_daily_log_id_fkey"
            columns: ["daily_log_id"]
            isOneToOne: false
            referencedRelation: "daily_logs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
