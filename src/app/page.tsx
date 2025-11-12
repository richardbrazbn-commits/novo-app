'use client'

import { useEffect, useState } from 'react'
import { Flame, TrendingUp, Target, Calendar, Sparkles } from 'lucide-react'
import { supabase, Meal } from '@/lib/supabase'
import { MealUpload } from '@/components/custom/meal-upload'
import { MealCard } from '@/components/custom/meal-card'
import { StatsCard } from '@/components/custom/stats-card'
import { ProgressRing } from '@/components/custom/progress-ring'
import { toast } from 'sonner'

export default function Home() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dailyStats, setDailyStats] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })

  const DAILY_GOAL = 2000 // Meta diária de calorias

  const loadMeals = async () => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', 'demo-user')
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false })

      if (error) throw error

      setMeals(data || [])

      // Calcular estatísticas do dia
      const stats = (data || []).reduce(
        (acc, meal) => ({
          calories: acc.calories + meal.calories,
          protein: acc.protein + meal.protein,
          carbs: acc.carbs + meal.carbs,
          fat: acc.fat + meal.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      )
      setDailyStats(stats)
    } catch (error) {
      console.error('Erro ao carregar refeições:', error)
      toast.error('Erro ao carregar refeições')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMeals()
  }, [])

  const caloriesProgress = Math.min((dailyStats.calories / DAILY_GOAL) * 100, 100)
  const remaining = Math.max(DAILY_GOAL - dailyStats.calories, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  BemFit
                </h1>
                <p className="text-xs text-gray-400">Seu tracker inteligente</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">
                {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Progress Ring Section */}
        <section className="flex flex-col items-center justify-center py-8">
          <ProgressRing
            progress={caloriesProgress}
            size={200}
            strokeWidth={12}
            label="de 2000 kcal"
            value={`${dailyStats.calories}`}
          />
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 mb-1">Restante para meta</p>
            <p className="text-3xl font-bold text-white">{remaining} kcal</p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="Proteína"
            value={`${dailyStats.protein}g`}
            subtitle="Meta: 150g"
            icon={TrendingUp}
            gradient="from-red-500 to-pink-500"
            progress={Math.min((dailyStats.protein / 150) * 100, 100)}
          />
          <StatsCard
            title="Carboidratos"
            value={`${dailyStats.carbs}g`}
            subtitle="Meta: 250g"
            icon={Target}
            gradient="from-amber-500 to-orange-500"
            progress={Math.min((dailyStats.carbs / 250) * 100, 100)}
          />
          <StatsCard
            title="Gorduras"
            value={`${dailyStats.fat}g`}
            subtitle="Meta: 65g"
            icon={Flame}
            gradient="from-blue-500 to-cyan-500"
            progress={Math.min((dailyStats.fat / 65) * 100, 100)}
          />
        </section>

        {/* Upload Section */}
        <section>
          <MealUpload onUploadSuccess={loadMeals} />
        </section>

        {/* Meals History */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Refeições de Hoje</h2>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">
              {meals.length} {meals.length === 1 ? 'refeição' : 'refeições'}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Carregando refeições...</p>
              </div>
            </div>
          ) : meals.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-gray-900/50 border border-gray-800">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Flame className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Nenhuma refeição registrada</h3>
              <p className="text-gray-400 text-sm">
                Adicione sua primeira refeição para começar a acompanhar suas calorias
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
