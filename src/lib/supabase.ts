import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'director' | 'docente' | 'familia'
          full_name: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role: 'director' | 'docente' | 'familia'
          full_name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'director' | 'docente' | 'familia'
          full_name?: string
          created_at?: string
        }
      }
      students: {
        Row: {
          id: string
          full_name: string
          dni: string
          birth_date: string
          course_id: string
          parent_id: string
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          dni: string
          birth_date: string
          course_id: string
          parent_id: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          dni?: string
          birth_date?: string
          course_id?: string
          parent_id?: string
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          name: string
          year: number
          division: string
          teacher_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          year: number
          division: string
          teacher_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          year?: number
          division?: string
          teacher_id?: string
          created_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          course_id: string
          teacher_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          course_id: string
          teacher_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          course_id?: string
          teacher_id?: string
          created_at?: string
        }
      }
      grades: {
        Row: {
          id: string
          student_id: string
          subject_id: string
          grade: number
          trimester: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          subject_id: string
          grade: number
          trimester: number
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          subject_id?: string
          grade?: number
          trimester?: number
          date?: string
          created_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          date: string
          status: 'presente' | 'ausente' | 'tardanza'
          subject_id: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          date: string
          status: 'presente' | 'ausente' | 'tardanza'
          subject_id: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          date?: string
          status?: 'presente' | 'ausente' | 'tardanza'
          subject_id?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          title: string
          message: string
          recipient_id: string
          sender_id: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          message: string
          recipient_id: string
          sender_id: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          message?: string
          recipient_id?: string
          sender_id?: string
          read?: boolean
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          time: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          time: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          time?: string
          created_by?: string
          created_at?: string
        }
      }
      materials: {
        Row: {
          id: string
          title: string
          description: string
          file_url: string
          course_id: string
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          file_url: string
          course_id: string
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          file_url?: string
          course_id?: string
          uploaded_by?: string
          created_at?: string
        }
      }
    }
  }
}