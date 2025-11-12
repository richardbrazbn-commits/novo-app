'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface MealUploadProps {
  onUploadSuccess: () => void
}

export function MealUpload({ onUploadSuccess }: MealUploadProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida')
      return
    }

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Análise
    setIsAnalyzing(true)
    const formData = new FormData()
    formData.append('image', file)
    formData.append('userId', 'demo-user') // Em produção, usar ID real do usuário

    try {
      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao analisar refeição')
      }

      toast.success('Refeição analisada com sucesso!', {
        description: `${data.analysis.calories} calorias detectadas`,
      })
      
      setPreview(null)
      onUploadSuccess()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao analisar refeição', {
        description: error instanceof Error ? error.message : 'Tente novamente',
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file)
        }}
      />

      {preview ? (
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-emerald-500 bg-gray-900 p-4">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
          {isAnalyzing && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm rounded-xl">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-3" />
                <p className="text-white font-medium">Analisando refeição...</p>
                <p className="text-gray-400 text-sm mt-1">Identificando alimentos e nutrientes</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleButtonClick}
          disabled={isAnalyzing}
          className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Camera className="w-8 h-8 text-white" />
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Adicionar Refeição</h3>
            <p className="text-emerald-50 text-sm mb-4">
              Tire uma foto ou selecione da galeria
            </p>
            <div className="flex items-center justify-center gap-2 text-emerald-50 text-xs">
              <Upload className="w-4 h-4" />
              <span>Análise automática com IA</span>
            </div>
          </div>
        </button>
      )}
    </div>
  )
}
