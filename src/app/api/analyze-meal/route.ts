import { NextRequest, NextResponse } from 'next/server'
import { analyzeMealImage } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const userId = formData.get('userId') as string

    if (!file) {
      return NextResponse.json({ error: 'Nenhuma imagem fornecida' }, { status: 400 })
    }

    // Converter imagem para base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    // Analisar com OpenAI
    const analysis = await analyzeMealImage(base64)

    // Upload da imagem para Supabase Storage
    const fileName = `${userId}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('meals')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Erro no upload:', uploadError)
      return NextResponse.json({ error: 'Erro ao fazer upload da imagem' }, { status: 500 })
    }

    // Obter URL pública da imagem
    const { data: urlData } = supabase.storage
      .from('meals')
      .getPublicUrl(fileName)

    // Salvar no banco de dados
    const { data: mealData, error: dbError } = await supabase
      .from('meals')
      .insert({
        user_id: userId,
        image_url: urlData.publicUrl,
        foods: analysis.foods,
        calories: analysis.calories,
        protein: analysis.protein,
        carbs: analysis.carbs,
        fat: analysis.fat,
        analysis: analysis.analysis,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Erro no banco:', dbError)
      return NextResponse.json({ error: 'Erro ao salvar refeição' }, { status: 500 })
    }

    return NextResponse.json({ success: true, meal: mealData, analysis })
  } catch (error) {
    console.error('Erro na análise:', error)
    return NextResponse.json(
      { error: 'Erro ao processar refeição', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
