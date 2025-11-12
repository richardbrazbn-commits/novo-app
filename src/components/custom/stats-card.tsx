import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  gradient: string
  progress?: number
}

export function StatsCard({ title, value, subtitle, icon: Icon, gradient, progress }: StatsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          {progress !== undefined && (
            <span className="text-sm font-medium text-gray-400">{progress}%</span>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
          <div
            className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
