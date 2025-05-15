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
      categories: {
        Row: {
          created_at: string
          id: number
          name: string
          order: number | null
          type_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          order?: number | null
          type_id: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          order?: number | null
          type_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "transaction_types"
            referencedColumns: ["id"]
          },
        ]
      }
      currencies: {
        Row: {
          code: string
          created_at: string
          id: number
          name: string
          symbol: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          name: string
          symbol: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          name?: string
          symbol?: string
        }
        Relationships: []
      }
      goal_category_map: {
        Row: {
          category_id: number
          created_at: string
          goal_id: number
          id: number
          user_id: string
        }
        Insert: {
          category_id: number
          created_at?: string
          goal_id: number
          id?: number
          user_id?: string
        }
        Update: {
          category_id?: number
          created_at?: string
          goal_id?: number
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_category_map_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goal_category_map_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          amount: number
          created_at: string
          currency_id: number
          end: string
          id: number
          name: string
          period: string
          rule: string
          start: string
          status: string
          type_id: number
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_id: number
          end: string
          id?: number
          name: string
          period: string
          rule: string
          start: string
          status: string
          type_id: number
          user_id?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_id?: number
          end?: string
          id?: number
          name?: string
          period?: string
          rule?: string
          start?: string
          status?: string
          type_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "transaction_types"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: number
          name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transaction_macros: {
        Row: {
          active: boolean
          amount: number | null
          category_id: number | null
          created_at: string
          currency_id: number | null
          day: number | null
          hour: number | null
          id: number
          memo: string | null
          minute: number | null
          name: string
          type_id: number | null
          user_id: string
        }
        Insert: {
          active: boolean
          amount?: number | null
          category_id?: number | null
          created_at?: string
          currency_id?: number | null
          day?: number | null
          hour?: number | null
          id?: number
          memo?: string | null
          minute?: number | null
          name: string
          type_id?: number | null
          user_id: string
        }
        Update: {
          active?: boolean
          amount?: number | null
          category_id?: number | null
          created_at?: string
          currency_id?: number | null
          day?: number | null
          hour?: number | null
          id?: number
          memo?: string | null
          minute?: number | null
          name?: string
          type_id?: number | null
          user_id?: string
        }
        Relationships: []
      }
      transaction_types: {
        Row: {
          config: Json | null
          created_at: string
          id: number
          name: string
          order: number | null
        }
        Insert: {
          config?: Json | null
          created_at?: string
          id?: number
          name: string
          order?: number | null
        }
        Update: {
          config?: Json | null
          created_at?: string
          id?: number
          name?: string
          order?: number | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category_id: number
          created_at: string
          currency_id: number
          date: string | null
          id: number
          memo: string | null
          type_id: number
          updated_at: string
          usd_rate: number
          user_id: string
        }
        Insert: {
          amount: number
          category_id: number
          created_at?: string
          currency_id: number
          date?: string | null
          id?: number
          memo?: string | null
          type_id: number
          updated_at?: string
          usd_rate: number
          user_id?: string
        }
        Update: {
          amount?: number
          category_id?: number
          created_at?: string
          currency_id?: number
          date?: string | null
          id?: number
          memo?: string | null
          type_id?: number
          updated_at?: string
          usd_rate?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_currency_id_fkey"
            columns: ["currency_id"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "transaction_types"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
