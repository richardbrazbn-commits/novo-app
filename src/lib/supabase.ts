import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Meal = {
  id: string
  user_id: string
  image_url: string
  foods: string[]
  calories: number
  protein: number
  carbs: number
  fat: number
  analysis: string
  created_at: string
}
