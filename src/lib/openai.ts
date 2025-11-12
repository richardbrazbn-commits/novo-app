import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function analyzeMealImage(imageBase64: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analise esta imagem de refeição e forneça uma resposta em JSON com a seguinte estrutura:
{
  "foods": ["lista de alimentos identificados"],
  "calories": número total estimado de calorias,
  "protein": gramas de proteína,
  "carbs": gramas de carboidratos,
  "fat": gramas de gordura,
  "analysis": "descrição detalhada da refeição, quantidades estimadas e observações nutricionais"
}

Seja preciso nas estimativas de peso/quantidade e calorias. Considere porções típicas.`,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0].message.content
  return JSON.parse(content || '{}')
}
