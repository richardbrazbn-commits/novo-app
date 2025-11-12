'use client'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  value?: string
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = 'from-emerald-400 to-teal-500',
  label,
  value,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-800"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="text-emerald-400" stopColor="currentColor" />
            <stop offset="100%" className="text-teal-500" stopColor="currentColor" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        {value && (
          <span className="text-2xl font-bold text-white">{value}</span>
        )}
        {label && (
          <span className="text-xs text-gray-400 mt-1">{label}</span>
        )}
      </div>
    </div>
  )
}
