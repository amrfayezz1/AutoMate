export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      cars: {
        Row: {
          created_at: string;
          current_odometer: number;
          id: string;
          make: string;
          model: string;
          plate_number: string;
          tracking_mode: string;
          updated_at: string;
          user_id: string;
          year: number;
        };
        Insert: {
          created_at?: string;
          current_odometer?: number;
          id?: string;
          make: string;
          model: string;
          plate_number: string;
          tracking_mode?: string;
          updated_at?: string;
          user_id: string;
          year: number;
        };
        Update: {
          created_at?: string;
          current_odometer?: number;
          id?: string;
          make?: string;
          model?: string;
          plate_number?: string;
          tracking_mode?: string;
          updated_at?: string;
          user_id?: string;
          year?: number;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          car_id: string;
          created_at: string;
          expiry_date: string;
          file_url: string | null;
          id: string;
          name: string;
          notes: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          car_id: string;
          created_at?: string;
          expiry_date: string;
          file_url?: string | null;
          id?: string;
          name: string;
          notes?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          car_id?: string;
          created_at?: string;
          expiry_date?: string;
          file_url?: string | null;
          id?: string;
          name?: string;
          notes?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_car_id_fkey";
            columns: ["car_id"];
            isOneToOne: false;
            referencedRelation: "cars";
            referencedColumns: ["id"];
          },
        ];
      };
      maintenance_records: {
        Row: {
          car_id: string;
          cost: number | null;
          created_at: string;
          id: string;
          mileage_at_service: number | null;
          next_due_date: string | null;
          next_due_km: number | null;
          notes: string | null;
          photo_url: string | null;
          provider_name: string | null;
          serviced_at: string;
          type_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          car_id: string;
          cost?: number | null;
          created_at?: string;
          id?: string;
          mileage_at_service?: number | null;
          next_due_date?: string | null;
          next_due_km?: number | null;
          notes?: string | null;
          photo_url?: string | null;
          provider_name?: string | null;
          serviced_at: string;
          type_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          car_id?: string;
          cost?: number | null;
          created_at?: string;
          id?: string;
          mileage_at_service?: number | null;
          next_due_date?: string | null;
          next_due_km?: number | null;
          notes?: string | null;
          photo_url?: string | null;
          provider_name?: string | null;
          serviced_at?: string;
          type_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "maintenance_records_car_id_fkey";
            columns: ["car_id"];
            isOneToOne: false;
            referencedRelation: "cars";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "maintenance_records_type_id_fkey";
            columns: ["type_id"];
            isOneToOne: false;
            referencedRelation: "maintenance_types";
            referencedColumns: ["id"];
          },
        ];
      };
      maintenance_types: {
        Row: {
          color: string;
          default_interval_days: number | null;
          default_interval_km: number | null;
          icon: string;
          id: string;
          is_default: boolean;
          name: string;
          sort_order: number;
          user_id: string | null;
        };
        Insert: {
          color: string;
          default_interval_days?: number | null;
          default_interval_km?: number | null;
          icon?: string;
          id: string;
          is_default?: boolean;
          name: string;
          sort_order?: number;
          user_id?: string | null;
        };
        Update: {
          color?: string;
          default_interval_days?: number | null;
          default_interval_km?: number | null;
          icon?: string;
          id?: string;
          is_default?: boolean;
          name?: string;
          sort_order?: number;
          user_id?: string | null;
        };
        Relationships: [];
      };
      odometer_logs: {
        Row: {
          car_id: string;
          id: string;
          reading: number;
          recorded_at: string;
          user_id: string;
        };
        Insert: {
          car_id: string;
          id?: string;
          reading: number;
          recorded_at?: string;
          user_id: string;
        };
        Update: {
          car_id?: string;
          id?: string;
          reading?: number;
          recorded_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "odometer_logs_car_id_fkey";
            columns: ["car_id"];
            isOneToOne: false;
            referencedRelation: "cars";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          expo_push_token: string | null;
          full_name: string | null;
          id: string;
          notifications_enabled: boolean;
          preferred_language: string;
          theme: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          expo_push_token?: string | null;
          full_name?: string | null;
          id: string;
          notifications_enabled?: boolean;
          preferred_language?: string;
          theme?: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          expo_push_token?: string | null;
          full_name?: string | null;
          id?: string;
          notifications_enabled?: boolean;
          preferred_language?: string;
          theme?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reminders: {
        Row: {
          advance_days: number;
          advance_km: number | null;
          car_id: string;
          created_at: string;
          document_id: string | null;
          id: string;
          is_active: boolean;
          last_sent_at: string | null;
          reminder_type: string;
          type_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          advance_days?: number;
          advance_km?: number | null;
          car_id: string;
          created_at?: string;
          document_id?: string | null;
          id?: string;
          is_active?: boolean;
          last_sent_at?: string | null;
          reminder_type?: string;
          type_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          advance_days?: number;
          advance_km?: number | null;
          car_id?: string;
          created_at?: string;
          document_id?: string | null;
          id?: string;
          is_active?: boolean;
          last_sent_at?: string | null;
          reminder_type?: string;
          type_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reminders_car_id_fkey";
            columns: ["car_id"];
            isOneToOne: false;
            referencedRelation: "cars";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reminders_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reminders_type_id_fkey";
            columns: ["type_id"];
            isOneToOne: false;
            referencedRelation: "maintenance_types";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
