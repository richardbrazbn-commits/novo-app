import { Flame, Beef, Wheat, Droplet } from 'lucide-react'
import Image from 'next/image'
import { Meal } from '@/lib/supabase'

interface MealCardProps {
  meal: Meal
}

export function MealCard({ meal }: MealCardProps) {
  const formattedDate = new Date(meal.created_at).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-[1.02]">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={meal.image_url}
          alt="Refeição"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400">{formattedDate}</span>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
            <Flame className="w-3 h-3 text-white" />
            <span className="text-sm font-bold text-white">{meal.calories}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {meal.foods.slice(0, 3).map((food, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium text-gray-300 bg-gray-800 rounded-full border border-gray-700"
            >
              {food}
            </span>
          ))}
          {meal.foods.length > 3 && (
            <span className="px-3 py-1 text-xs font-medium text-gray-400 bg-gray-800/50 rounded-full">
              +{meal.foods.length - 3}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
            <Beef className="w-4 h-4 text-red-400" />
            <div>
              <p className="text-xs text-gray-400">Proteína</p>
              <p className="text-sm font-bold text-white">{meal.protein}g</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
            <Wheat className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-xs text-gray-400">Carbs</p>
              <p className="text-sm font-bold text-white">{meal.carbs}g</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
            <Droplet className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-xs text-gray-400">Gordura</p>
              <p className="text-sm font-bold text-white">{meal.fat}g</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
