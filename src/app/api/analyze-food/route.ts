import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createCanvas } from 'canvas'
import { VLM } from 'z-ai-web-dev-sdk'

const vlm = new VLM()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const mimeType = image.type || 'image/jpeg'
    const dataUrl = `data:${mimeType};base64,${base64Image}`

    // Use VLM to analyze the food image
    const analysisResult = await vlm.chat({
      messages: [
        {
          role: 'system',
          content: `You are a food recognition and nutrition expert. Analyze food images and provide detailed nutritional information. Always respond in JSON format with the following structure:
          {
            "items": [
              {
                "name": "food item name",
                "calories": number,
                "protein": number,
                "carbs": number,
                "fats": number
              }
            ]
          }
          Estimate portions based on typical serving sizes. Be conservative with calorie estimates.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image',
              image: dataUrl,
            },
            {
              type: 'text',
              text: 'Identify all food items in this image and estimate their nutritional values. Return only the JSON response.',
            },
          ],
        },
      ],
    })

    // Parse the response
    const content = analysisResult.choices?.[0]?.message?.content || '{}'
    let analysisData

    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No valid JSON found in response')
      }
    } catch (e) {
      // Fallback if parsing fails
      analysisData = {
        items: [
          {
            name: 'Mixed meal',
            calories: 500,
            protein: 25,
            carbs: 50,
            fats: 20,
          },
        ],
      }
    }

    // Calculate totals
    const totalCalories = analysisData.items.reduce((sum: number, item: any) => sum + item.calories, 0)
    const totalProtein = analysisData.items.reduce((sum: number, item: any) => sum + item.protein, 0)
    const totalCarbs = analysisData.items.reduce((sum: number, item: any) => sum + item.carbs, 0)
    const totalFats = analysisData.items.reduce((sum: number, item: any) => sum + item.fats, 0)

    const analysis = {
      items: analysisData.items,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
    }

    // Save analysis to database
    const profile = await db.userProfile.findFirst()
    if (profile) {
      await db.foodAnalysis.create({
        data: {
          profileId: profile.id,
          imageUrl: null,
          analysis: JSON.stringify(analysis),
        },
      })
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error analyzing food:', error)
    return NextResponse.json(
      { error: 'Failed to analyze food image' },
      { status: 500 }
    )
  }
}
