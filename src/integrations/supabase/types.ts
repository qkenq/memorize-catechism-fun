export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      churches: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          quiz_ids: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          quiz_ids?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          quiz_ids?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          church_id: string | null
          created_at: string
          display_name: string | null
          id: string
          last_activity_date: string | null
          level: number | null
          role: Database["public"]["Enums"]["app_role"]
          streak_days: number
          username: string | null
          xp: number
        }
        Insert: {
          age?: number | null
          church_id?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          last_activity_date?: string | null
          level?: number | null
          role?: Database["public"]["Enums"]["app_role"]
          streak_days?: number
          username?: string | null
          xp?: number
        }
        Update: {
          age?: number | null
          church_id?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          last_activity_date?: string | null
          level?: number | null
          role?: Database["public"]["Enums"]["app_role"]
          streak_days?: number
          username?: string | null
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      progress: {
        Row: {
          completed_at: string
          current_round: number
          id: string
          last_attempt_date: string | null
          level: number
          lords_day_id: number
          score: number
          total_time_spent: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          current_round?: number
          id?: string
          last_attempt_date?: string | null
          level?: number
          lords_day_id: number
          score?: number
          total_time_spent?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          current_round?: number
          id?: string
          last_attempt_date?: string | null
          level?: number
          lords_day_id?: number
          score?: number
          total_time_spent?: number | null
          user_id?: string
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          created_at: string
          created_by: string
          full_text: string | null
          gap_text: string[]
          gaps: Json[] | null
          id: string
          input_type: Database["public"]["Enums"]["quiz_type"][] | null
          title: string
          type: Database["public"]["Enums"]["quiz_type"]
          updated_at: string
          visible_text: string[]
        }
        Insert: {
          created_at?: string
          created_by: string
          full_text?: string | null
          gap_text: string[]
          gaps?: Json[] | null
          id?: string
          input_type?: Database["public"]["Enums"]["quiz_type"][] | null
          title: string
          type?: Database["public"]["Enums"]["quiz_type"]
          updated_at?: string
          visible_text: string[]
        }
        Update: {
          created_at?: string
          created_by?: string
          full_text?: string | null
          gap_text?: string[]
          gaps?: Json[] | null
          id?: string
          input_type?: Database["public"]["Enums"]["quiz_type"][] | null
          title?: string
          type?: Database["public"]["Enums"]["quiz_type"]
          updated_at?: string
          visible_text?: string[]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      process_text_gaps: {
        Args: {
          text_content: string
        }
        Returns: Record<string, unknown>
      }
    }
    Enums: {
      app_role: "admin" | "member"
      quiz_type: "drag_and_drop" | "fill_in_blank" | "multiple_choice"
    }
    CompositeTypes: {
      gap_structure: {
        answer: string | null
        start_index: number | null
        end_index: number | null
        input_type: Database["public"]["Enums"]["quiz_type"] | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
