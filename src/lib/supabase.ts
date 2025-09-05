import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          updated_at?: string
        }
      }
      tours: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: 'draft' | 'processing' | 'published'
          view_count: number
          thumbnail_url: string | null
          share_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          status?: 'draft' | 'processing' | 'published'
          view_count?: number
          thumbnail_url?: string | null
          share_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: 'draft' | 'processing' | 'published'
          view_count?: number
          thumbnail_url?: string | null
          share_token?: string | null
          updated_at?: string
        }
      }
      tour_images: {
        Row: {
          id: string
          tour_id: string
          image_url: string
          order_index: number
          title: string | null
          hotspots: any | null
          created_at: string
        }
        Insert: {
          id?: string
          tour_id: string
          image_url: string
          order_index: number
          title?: string | null
          hotspots?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          tour_id?: string
          image_url?: string
          order_index?: number
          title?: string | null
          hotspots?: any | null
        }
      }
    }
  }
}