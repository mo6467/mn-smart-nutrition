import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

function calculateBMR(age: number, gender: string, weight: number, height: number, bodyFat?: number | null) {
  // Mifflin-St Jeor Equation
  let bmr: number

  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  // Katch-McArdle if body fat is available
  if (bodyFat && bodyFat > 0) {
    const leanBodyMass = weight * (1 - bodyFat / 100)
    const katchMcArdle = 370 + 21.6 * leanBodyMass
    // Average of both methods for better accuracy
    bmr = (bmr + katchMcArdle) / 2
  }

  return bmr
}

function getActivityMultiplier(activityLevel: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    highly_active: 1.725,
    athlete: 1.9,
  }
  return multipliers[activityLevel] || 1.55
}

function getCalorieAdjustment(goal: string, tdee: number): number {
  switch (goal) {
    case 'fat_loss':
      return tdee * 0.85 // 15% deficit
    case 'hypertrophy':
      return tdee * 1.05 // 5% surplus
    case 'strength':
      return tdee * 1.025 // 2.5% surplus
    default:
      return tdee // maintenance
  }
}

function calculateMacros(
  targetCalories: number,
  weight: number,
  goal: string,
  trainingType: string,
  dietaryStyle: string
) {
  let proteinRatio = 0.25 // default
  let carbRatio = 0.45
  let fatRatio = 0.30

  // Adjust based on goal
  if (goal === 'hypertrophy' || goal === 'strength') {
    proteinRatio = 0.30
    carbRatio = 0.45
    fatRatio = 0.25
  } else if (goal === 'fat_loss') {
    proteinRatio = 0.35 // higher protein for satiety and muscle retention
    carbRatio = 0.30
    fatRatio = 0.35
  }

  // Adjust based on dietary style
  if (dietaryStyle === 'low_carb' || dietaryStyle === 'keto') {
    proteinRatio = 0.30
    carbRatio = 0.10
    fatRatio = 0.60
  } else if (dietaryStyle === 'high_protein') {
    proteinRatio = 0.40
    carbRatio = 0.35
    fatRatio = 0.25
  }

  const proteinGrams = (targetCalories * proteinRatio) / 4
  const carbGrams = (targetCalories * carbRatio) / 4
  const fatGrams = (targetCalories * fatRatio) / 9

  return {
    proteinGrams,
    carbsGrams: carbGrams,
    fatsGrams: fatGrams,
    proteinPercent: proteinRatio * 100,
    carbsPercent: carbRatio * 100,
    fatsPercent: fatRatio * 100,
  }
}

export async function GET() {
  try {
    const profile = await db.userProfile.findUnique({
      where: { id: 'default-profile' },
    })

    if (!profile) {
      return NextResponse.json(null)
    }

    const bmr = calculateBMR(
      profile.age,
      profile.gender,
      profile.currentWeight,
      profile.height,
      profile.bodyFatPercent
    )

    const activityMultiplier = getActivityMultiplier(profile.activityLevel)
    const tdee = bmr * activityMultiplier

    const targetCalories = getCalorieAdjustment(profile.primaryGoal, tdee)

    const macros = calculateMacros(
      targetCalories,
      profile.currentWeight,
      profile.primaryGoal,
      profile.trainingType,
      profile.dietaryStyle
    )

    // Save or update nutrition plan
    await db.nutritionPlan.upsert({
      where: { id: 'default-plan' },
      update: {
        bmr,
        tdee,
        targetCalories,
        proteinGrams: macros.proteinGrams,
        carbsGrams: macros.carbsGrams,
        fatsGrams: macros.fatsGrams,
        proteinPercent: macros.proteinPercent,
        carbsPercent: macros.carbsPercent,
        fatsPercent: macros.fatsPercent,
      },
      create: {
        id: 'default-plan',
        profileId: profile.id,
        bmr,
        tdee,
        targetCalories,
        proteinGrams: macros.proteinGrams,
        carbsGrams: macros.carbsGrams,
        fatsGrams: macros.fatsGrams,
        proteinPercent: macros.proteinPercent,
        carbsPercent: macros.carbsPercent,
        fatsPercent: macros.fatsPercent,
        mealPlan: JSON.stringify({ meals: [] }),
      },
    })

    return NextResponse.json({
      bmr,
      tdee,
      targetCalories,
      ...macros,
    })
  } catch (error) {
    console.error('Error calculating nutrition:', error)
    return NextResponse.json(
      { error: 'Failed to calculate nutrition' },
      { status: 500 }
    )
  }
}
