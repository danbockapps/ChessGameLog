export type Json = string | number | boolean | null | {[key: string]: Json | undefined} | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      collections: {
        Row: {
          id: string
          last_refreshed: string | null
          name: string
          owner_id: string | null
          site: Database['public']['Enums']['site_type'] | null
          username: string | null
        }
        Insert: {
          id?: string
          last_refreshed?: string | null
          name: string
          owner_id?: string | null
          site?: Database['public']['Enums']['site_type'] | null
          username?: string | null
        }
        Update: {
          id?: string
          last_refreshed?: string | null
          name?: string
          owner_id?: string | null
          site?: Database['public']['Enums']['site_type'] | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'collections_owner_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      games: {
        Row: {
          black_rating: number | null
          black_result: string | null
          black_username: string | null
          clock_increment: number | null
          clock_initial: number | null
          collection_id: string | null
          created_at: string
          eco: string | null
          fen: string | null
          game_dttm: string | null
          id: number
          lichess_game_id: string | null
          site: Database['public']['Enums']['site_type'] | null
          time_control: string | null
          url: string | null
          white_rating: number | null
          white_result: string | null
          white_username: string | null
          winner: string | null
        }
        Insert: {
          black_rating?: number | null
          black_result?: string | null
          black_username?: string | null
          clock_increment?: number | null
          clock_initial?: number | null
          collection_id?: string | null
          created_at?: string
          eco?: string | null
          fen?: string | null
          game_dttm?: string | null
          id?: number
          lichess_game_id?: string | null
          site?: Database['public']['Enums']['site_type'] | null
          time_control?: string | null
          url?: string | null
          white_rating?: number | null
          white_result?: string | null
          white_username?: string | null
          winner?: string | null
        }
        Update: {
          black_rating?: number | null
          black_result?: string | null
          black_username?: string | null
          clock_increment?: number | null
          clock_initial?: number | null
          collection_id?: string | null
          created_at?: string
          eco?: string | null
          fen?: string | null
          game_dttm?: string | null
          id?: number
          lichess_game_id?: string | null
          site?: Database['public']['Enums']['site_type'] | null
          time_control?: string | null
          url?: string | null
          white_rating?: number | null
          white_result?: string | null
          white_username?: string | null
          winner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'games_collection_fkey'
            columns: ['collection_id']
            isOneToOne: false
            referencedRelation: 'collections'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
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
      site_type: 'lichess' | 'chess.com'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | {schema: keyof Database},
  TableName extends PublicTableNameOrOptions extends {schema: keyof Database}
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends {schema: keyof Database}
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | {schema: keyof Database},
  TableName extends PublicTableNameOrOptions extends {schema: keyof Database}
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends {schema: keyof Database}
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | {schema: keyof Database},
  TableName extends PublicTableNameOrOptions extends {schema: keyof Database}
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends {schema: keyof Database}
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | {schema: keyof Database},
  EnumName extends PublicEnumNameOrOptions extends {schema: keyof Database}
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends {schema: keyof Database}
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
