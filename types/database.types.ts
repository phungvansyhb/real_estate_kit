export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string | null
          avatar_url: string | null
          company: string | null
          bio: string | null
          plan: 'free' | 'starter' | 'pro'
          created_at: string
        }
        Insert: {
          id: string
          name: string
          phone?: string | null
          email?: string | null
          avatar_url?: string | null
          company?: string | null
          bio?: string | null
          plan?: 'free' | 'starter' | 'pro'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          email?: string | null
          avatar_url?: string | null
          company?: string | null
          bio?: string | null
          plan?: 'free' | 'starter' | 'pro'
          created_at?: string
        }
        Relationships: []
      }
      listings: {
        Row: {
          id: string
          user_id: string
          slug: string
          title: string
          description: string
          price: number
          area: number
          bedrooms: number | null
          bathrooms: number | null
          address: string
          district: string
          city: string
          type: 'sell' | 'rent'
          property_type: 'apartment' | 'house' | 'land' | 'villa' | 'shophouse'
          property_subtype: string | null
          amenities: string[]
          highlights: string[]
          images: string[]
          status: 'active' | 'sold' | 'rented' | 'draft'
          view_count: number
          leads_count: number
          source_breakdown: Json
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          title: string
          description?: string
          price?: number
          area?: number
          bedrooms?: number | null
          bathrooms?: number | null
          address: string
          district: string
          city: string
          type: 'sell' | 'rent'
          property_type: 'apartment' | 'house' | 'land' | 'villa' | 'shophouse'
          property_subtype?: string | null
          amenities?: string[]
          highlights?: string[]
          images?: string[]
          status?: 'active' | 'sold' | 'rented' | 'draft'
          view_count?: number
          leads_count?: number
          source_breakdown?: Json
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          slug?: string
          title?: string
          description?: string
          price?: number
          area?: number
          bedrooms?: number | null
          bathrooms?: number | null
          address?: string
          district?: string
          city?: string
          type?: 'sell' | 'rent'
          property_type?: 'apartment' | 'house' | 'land' | 'villa' | 'shophouse'
          property_subtype?: string | null
          amenities?: string[]
          highlights?: string[]
          images?: string[]
          status?: 'active' | 'sold' | 'rented' | 'draft'
          view_count?: number
          leads_count?: number
          source_breakdown?: Json
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'listings_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      leads: {
        Row: {
          id: string
          listing_id: string
          name: string
          phone: string
          note: string | null
          preferred_time: string | null
          source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          name: string
          phone: string
          note?: string | null
          preferred_time?: string | null
          source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          name?: string
          phone?: string
          note?: string | null
          preferred_time?: string | null
          source?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'leads_listing_id_fkey'
            columns: ['listing_id']
            isOneToOne: false
            referencedRelation: 'listings'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      public_agent_profiles: {
        Row: {
          id: string | null
          name: string | null
          phone: string | null
          avatar_url: string | null
          company: string | null
          bio: string | null
          plan: 'free' | 'starter' | 'pro' | null
        }
        Insert: {
          id?: string | null
          name?: string | null
          phone?: string | null
          avatar_url?: string | null
          company?: string | null
          bio?: string | null
          plan?: 'free' | 'starter' | 'pro' | null
        }
        Update: {
          id?: string | null
          name?: string | null
          phone?: string | null
          avatar_url?: string | null
          company?: string | null
          bio?: string | null
          plan?: 'free' | 'starter' | 'pro' | null
        }
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
