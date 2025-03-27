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
          date_unit: string
          end: string
          id: number
          name: string
          period: number
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
          date_unit: string
          end: string
          id?: number
          name: string
          period: number
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
          date_unit?: string
          end?: string
          id?: number
          name?: string
          period?: number
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
      macros: {
        Row: {
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
      transaction_types: {
        Row: {
          created_at: string
          id: number
          name: string
          order: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          order?: number | null
        }
        Update: {
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
