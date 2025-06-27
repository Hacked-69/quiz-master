import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      quizzes: {
        Row: {
          id: string
          title: string
          description: string | null
          time_limit: number
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          time_limit: number
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          time_limit?: number
          created_by?: string
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          quiz_id: string
          question_text: string
          options: string[]
          correct_answer: number
          created_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          question_text: string
          options: string[]
          correct_answer: number
          created_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          question_text?: string
          options?: string[]
          correct_answer?: number
          created_at?: string
        }
      }
      quiz_attempts: {
        Row: {
          id: string
          quiz_id: string
          user_id: string
          score: number
          total_questions: number
          completed_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          user_id: string
          score: number
          total_questions: number
          completed_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          user_id?: string
          score?: number
          total_questions?: number
          completed_at?: string
        }
      }
      quiz_feedback: {
        Row: {
          id: string
          quiz_id: string
          user_id: string
          attempt_id: string
          rating: number | null
          feedback_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          user_id: string
          attempt_id: string
          rating?: number | null
          feedback_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          user_id?: string
          attempt_id?: string
          rating?: number | null
          feedback_text?: string | null
          created_at?: string
        }
      }
    }
  }
}
