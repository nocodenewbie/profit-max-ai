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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      distributor_configs: {
        Row: {
          ai_instructions: string | null
          ai_personality: string | null
          catalog_file_name: string | null
          catalog_file_url: string | null
          catalog_uploaded_at: string | null
          created_at: string
          default_discount_percentage: number | null
          delivery_regions: string[] | null
          distributor_id: string
          id: string
          max_discount_percentage: number | null
          minimum_order_value: number | null
          payment_terms: string | null
          updated_at: string
          volume_discount_enabled: boolean | null
          volume_discount_rules: Json | null
        }
        Insert: {
          ai_instructions?: string | null
          ai_personality?: string | null
          catalog_file_name?: string | null
          catalog_file_url?: string | null
          catalog_uploaded_at?: string | null
          created_at?: string
          default_discount_percentage?: number | null
          delivery_regions?: string[] | null
          distributor_id: string
          id?: string
          max_discount_percentage?: number | null
          minimum_order_value?: number | null
          payment_terms?: string | null
          updated_at?: string
          volume_discount_enabled?: boolean | null
          volume_discount_rules?: Json | null
        }
        Update: {
          ai_instructions?: string | null
          ai_personality?: string | null
          catalog_file_name?: string | null
          catalog_file_url?: string | null
          catalog_uploaded_at?: string | null
          created_at?: string
          default_discount_percentage?: number | null
          delivery_regions?: string[] | null
          distributor_id?: string
          id?: string
          max_discount_percentage?: number | null
          minimum_order_value?: number | null
          payment_terms?: string | null
          updated_at?: string
          volume_discount_enabled?: boolean | null
          volume_discount_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "distributor_configs_distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: false
            referencedRelation: "distributors"
            referencedColumns: ["id"]
          },
        ]
      }
      distributors: {
        Row: {
          company_name: string
          created_at: string
          email: string
          id: string
          is_active: boolean
          updated_at: string
          widget_id: string
        }
        Insert: {
          company_name: string
          created_at?: string
          email: string
          id: string
          is_active?: boolean
          updated_at?: string
          widget_id: string
        }
        Update: {
          company_name?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          widget_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          cost_price: number
          created_at: string
          description: string | null
          distributor_id: string
          id: string
          product_name: string
          profit_margin: number
          selling_price: number
          sku: string
          technical_specs: string | null
          updated_at: string
        }
        Insert: {
          category: string
          cost_price: number
          created_at?: string
          description?: string | null
          distributor_id: string
          id?: string
          product_name: string
          profit_margin: number
          selling_price: number
          sku: string
          technical_specs?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          cost_price?: number
          created_at?: string
          description?: string | null
          distributor_id?: string
          id?: string
          product_name?: string
          profit_margin?: number
          selling_price?: number
          sku?: string
          technical_specs?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          conversation_id: string | null
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          discount_amount: number | null
          discount_applied: number | null
          distributor_id: string
          expires_at: string | null
          final_value: number
          id: string
          notes: string | null
          quote_items: Json
          status: string | null
          total_value: number
          updated_at: string
          widget_session_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          conversation_id?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          discount_applied?: number | null
          distributor_id: string
          expires_at?: string | null
          final_value?: number
          id?: string
          notes?: string | null
          quote_items?: Json
          status?: string | null
          total_value?: number
          updated_at?: string
          widget_session_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          conversation_id?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          discount_applied?: number | null
          distributor_id?: string
          expires_at?: string | null
          final_value?: number
          id?: string
          notes?: string | null
          quote_items?: Json
          status?: string | null
          total_value?: number
          updated_at?: string
          widget_session_id?: string | null
        }
        Relationships: []
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
