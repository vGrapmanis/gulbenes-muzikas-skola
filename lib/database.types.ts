// Hand-crafted from supabase/migrations/. Replace with the generated version
// once a Supabase project is connected: pnpm db:types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      pages: {
        Row: {
          id: string;
          slug: string;
          title: string | null;
          body: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title?: string | null;
          body?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string | null;
          body?: string | null;
          updated_at?: string;
        };
      };

      graduates: {
        Row: {
          id: string;
          year: number;
          full_name: string;
          program: string | null;
          teacher: string | null;
          display_order: number;
          published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          year: number;
          full_name: string;
          program?: string | null;
          teacher?: string | null;
          display_order?: number;
          published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          year?: number;
          full_name?: string;
          program?: string | null;
          teacher?: string | null;
          display_order?: number;
          published?: boolean;
          created_at?: string;
        };
      };

      news: {
        Row: {
          id: string;
          title: string;
          slug: string;
          body: string | null;
          poster_key: string;
          poster_alt: string;
          event_date: string | null;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          body?: string | null;
          poster_key: string;
          poster_alt: string;
          event_date?: string | null;
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          body?: string | null;
          poster_key?: string;
          poster_alt?: string;
          event_date?: string | null;
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      achievements: {
        Row: {
          id: string;
          title: string;
          student_name: string;
          competition: string | null;
          result: string | null;
          description: string | null;
          event_date: string | null;
          image_key: string | null;
          image_alt: string | null;
          display_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          student_name: string;
          competition?: string | null;
          result?: string | null;
          description?: string | null;
          event_date?: string | null;
          image_key?: string | null;
          image_alt?: string | null;
          display_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          student_name?: string;
          competition?: string | null;
          result?: string | null;
          description?: string | null;
          event_date?: string | null;
          image_key?: string | null;
          image_alt?: string | null;
          display_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      gallery_albums: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          cover_key: string | null;
          event_date: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          cover_key?: string | null;
          event_date?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          cover_key?: string | null;
          event_date?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      gallery_images: {
        Row: {
          id: string;
          album_id: string;
          image_key: string;
          caption: string | null;
          alt: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          album_id: string;
          image_key: string;
          caption?: string | null;
          alt?: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          album_id?: string;
          image_key?: string;
          caption?: string | null;
          alt?: string;
          display_order?: number;
          created_at?: string;
        };
      };

      documents: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string | null;
          file_key: string;
          file_size: number | null;
          display_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category?: string | null;
          file_key: string;
          file_size?: number | null;
          display_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category?: string | null;
          file_key?: string;
          file_size?: number | null;
          display_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience row-type aliases
export type Page       = Database['public']['Tables']['pages']['Row'];
export type Graduate   = Database['public']['Tables']['graduates']['Row'];
export type NewsItem   = Database['public']['Tables']['news']['Row'];
export type Achievement = Database['public']['Tables']['achievements']['Row'];
export type GalleryAlbum = Database['public']['Tables']['gallery_albums']['Row'];
export type GalleryImage = Database['public']['Tables']['gallery_images']['Row'];
export type Document   = Database['public']['Tables']['documents']['Row'];
