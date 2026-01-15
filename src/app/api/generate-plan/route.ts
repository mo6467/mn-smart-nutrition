import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const mealOptions = {
  breakfast: [
    {
      name: 'Oatmeal with Berries',
      foods: [
        { name: 'Rolled Oats', portion: '80g', calories: 300, protein: 10, carbs: 54, fats: 6 },
        { name: 'Greek Yogurt', portion: '150g', calories: 90, protein: 15, carbs: 6, fats: 2 },
        { name: 'Mixed Berries', portion: '100g', calories: 60, protein: 1, carbs: 14, fats: 0.5 },
      ],
    },
    {
      name: 'Eggs & Toast',
      foods: [
        { name: 'Whole Eggs', portion: '3 large', calories: 210, protein: 18, carbs: 1.5, fats: 15 },
        { name: 'Whole Grain Bread', portion: '2 slices', calories: 160, protein: 6, carbs: 30, fats: 2 },
        { name: 'Avocado', portion: '1/2', calories: 120, protein: 1.5, carbs: 6, fats: 10 },
      ],
    },
    {
      name: 'Protein Smoothie',
      foods: [
        { name: 'Protein Powder', portion: '1 scoop', calories: 120, protein: 24, carbs: 3, fats: 1 },
        { name: 'Banana', portion: '1 medium', calories: 105, protein: 1.3, carbs: 27, fats: 0.4 },
        { name: 'Almond Milk', portion: '250ml', calories: 35, protein: 1, carbs: 1, fats: 3 },
        { name: 'Peanut Butter', portion: '1 tbsp', calories: 90, protein: 4, carbs: 3, fats: 8 },
      ],
    },
  ],
  lunch: [
    {
      name: 'Grilled Chicken Salad',
      foods: [
        { name: 'Chicken Breast', portion: '150g', calories: 248, protein: 46, carbs: 0, fats: 5.5 },
        { name: 'Mixed Greens', portion: '150g', calories: 30, protein: 2, carbs: 6, fats: 0.4 },
        { name: 'Quinoa', portion: '100g cooked', calories: 120, protein: 4, carbs: 21, fats: 2 },
        { name: 'Olive Oil', portion: '1 tbsp', calories: 120, protein: 0, carbs: 0, fats: 14 },
      ],
    },
    {
      name: 'Tuna Wrap',
      foods: [
        { name: 'Canned Tuna', portion: '100g', calories: 116, protein: 26, carbs: 0, fats: 0.8 },
        { name: 'Whole Wheat Wrap', portion: '1 large', calories: 180, protein: 6, carbs: 30, fats: 4 },
        { name: 'Vegetables', portion: '100g', calories: 25, protein: 1, carbs: 5, fats: 0.2 },
        { name: 'Hummus', portion: '2 tbsp', calories: 70, protein: 3, carbs: 5, fats: 5 },
      ],
    },
  ],
  dinner: [
    {
      name: 'Salmon & Vegetables',
      foods: [
        { name: 'Salmon Fillet', portion: '150g', calories: 312, protein: 33, carbs: 0, fats: 19 },
        { name: 'Sweet Potato', portion: '200g', calories: 172, protein: 4, carbs: 40, fats: 0.3 },
        { name: 'Broccoli', portion: '150g', calories: 50, protein: 4, carbs: 10, fats: 0.5 },
        { name: 'Olive Oil', portion: '1 tbsp', calories: 120, protein: 0, carbs: 0, fats: 14 },
      ],
    },
  ],
  snacks: [
    {
      name: 'Greek Yogurt',
      foods: [
        { name: 'Greek Yogurt', portion: '200g', calories: 120, protein: 20, carbs: 8, fats: 2.5 },
        { name: 'Honey', portion: '1 tbsp', calories: 64, protein: 0.1, carbs: 17, fats: 0 },
        { name: 'Almonds', portion: '15g', calories: 86, protein: 3, carbs: 3, fats: 7.5 },
      ],
    },
    {
      name: 'Protein Bar',
      foods: [
        { name: 'Protein Bar', portion: '1 bar', calories: 200, protein: 20, carbs: 22, fats: 6 },
      ],
    },
  ],
}

const workoutTemplates = {
  resistance: {
    splits: ['Push/Pull/Legs', 'Upper/Lower', 'Body Part Split'],
    exercises: {
      push: [
        { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90s' },
        { name: 'Overhead Press', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Tricep Dips', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '45s' },
      ],
      pull: [
        { name: 'Deadlift', sets: 4, reps: '6-8', rest: '120s' },
        { name: 'Pull-ups', sets: 3, reps: '8-12', rest: '60s' },
        { name: 'Barbell Rows', sets: 3, reps: '8-10', rest: '90s' },
        { name: 'Face Pulls', sets: 3, reps: '12-15', rest: '45s' },
        { name: 'Bicep Curls', sets: 3, reps: '10-12', rest: '60s' },
      ],
      legs: [
        { name: 'Squats', sets: 4, reps: '8-10', rest: '120s' },
        { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', rest: '90s' },
        { name: 'Leg Press', sets: 3, reps: '12-15', rest: '60s' },
        { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '60s' },
        { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '45s' },
      ],
    },
  },
  cardio: {
    splits: ['Endurance Focus', 'HIIT Focus', 'Mixed Training'],
    exercises: {
      endurance: [
        { name: 'Steady State Cardio', sets: 1, reps: '30-45 min', rest: '0s' },
        { name: 'Light Stretching', sets: 1, reps: '10 min', rest: '0s' },
      ],
      hiit: [
        { name: 'Sprint Intervals', sets: 8, reps: '30s work / 30s rest', rest: '30s' },
        { name: 'Burpees', sets: 3, reps: '15', rest: '60s' },
        { name: 'Jump Rope', sets: 3, reps: '1 min', rest: '45s' },
      ],
      mixed: [
        { name: 'Warm-up Walk', sets: 1, reps: '5 min', rest: '0s' },
        { name: 'Moderate Cardio', sets: 1, reps: '20 min', rest: '0s' },
        { name: 'Intervals', sets: 6, reps: '1 min hard / 1 min easy', rest: '0s' },
        { name: 'Cool-down', sets: 1, reps: '5 min', rest: '0s' },
      ],
    },
  },
  crossfit: {
    splits: ['Full Body WOD', 'Strength + Metcon', 'Skill Focus'],
    exercises: {
      wod: [
        { name: 'Box Jumps', sets: 3, reps: '15', rest: '60s' },
        { name: 'Kettlebell Swings', sets: 3, reps: '20', rest: '60s' },
        { name: 'Push-ups', sets: 3, reps: '15', rest: '45s' },
        { name: 'Rowing', sets: 3, reps: '250m', rest: '60s' },
      ],
      strength: [
        { name: 'Clean & Jerk', sets: 4, reps: '5', rest: '120s' },
        { name: 'Front Squat', sets: 4, reps: '8', rest: '90s' },
        { name: 'Pull-ups', sets: 3, reps: 'AMRAP', rest: '90s' },
      ],
      skill: [
        { name: 'Double Unders', sets: 5, reps: '30s', rest: '60s' },
        { name: 'Handstand Hold', sets: 3, reps: '30s', rest: '60s' },
        { name: 'Toes-to-Bar', sets: 3, reps: '10', rest: '60s' },
      ],
    },
  },
  home: {
    splits: ['Full Body', 'Upper/Lower', 'Circuit Training'],
    exercises: {
      fullbody: [
        { name: 'Push-ups', sets: 3, reps: '15-20', rest: '45s' },
        { name: 'Bodyweight Squats', sets: 3, reps: '20', rest: '45s' },
        { name: 'Lunges', sets: 3, reps: '12 each', rest: '60s' },
        { name: 'Plank', sets: 3, reps: '45s', rest: '30s' },
        { name: 'Glute Bridges', sets: 3, reps: '15', rest: '45s' },
      ],
      upper: [
        { name: 'Push-ups', sets: 3, reps: '12-15', rest: '45s' },
        { name: 'Dips', sets: 3, reps: '10-15', rest: '45s' },
        { name: 'Pike Push-ups', sets: 3, reps: '10', rest: '45s' },
        { name: 'Superman Holds', sets: 3, reps: '30s', rest: '30s' },
      ],
      lower: [
        { name: 'Bodyweight Squats', sets: 4, reps: '20', rest: '60s' },
        { name: 'Lunges', sets: 3, reps: '12 each', rest: '60s' },
        { name: 'Glute Bridges', sets: 3, reps: '15', rest: '45s' },
        { name: 'Calf Raises', sets: 3, reps: '20', rest: '30s' },
      ],
    },
  },
}

function generateMealPlan(targetCalories: number, proteinGrams: number, carbsGrams: number, fatsGrams: number) {
  const meals = [
    {
      name: 'Breakfast',
      foods: mealOptions.breakfast[Math.floor(Math.random() * mealOptions.breakfast.length)].foods,
    },
    {
      name: 'Lunch',
      foods: mealOptions.lunch[Math.floor(Math.random() * mealOptions.lunch.length)].foods,
    },
    {
      name: 'Dinner',
      foods: mealOptions.dinner[Math.floor(Math.random() * mealOptions.dinner.length)].foods,
    },
    {
      name: 'Snack',
      foods: mealOptions.snacks[Math.floor(Math.random() * mealOptions.snacks.length)].foods,
    },
  ]

  // Calculate totals
  const mealsWithTotals = meals.map((meal) => {
    const totals = meal.foods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fats: acc.fats + food.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    )

    return {
      ...meal,
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFats: totals.fats,
    }
  })

  const dailyTotal = mealsWithTotals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.totalCalories,
      protein: acc.protein + meal.totalProtein,
      carbs: acc.carbs + meal.totalCarbs,
      fats: acc.fats + meal.totalFats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  )

  return {
    meals: mealsWithTotals,
    dailyTotal,
  }
}

function generateWorkoutPlan(trainingDays: number, trainingType: string) {
  const template = workoutTemplates[trainingType as keyof typeof workoutTemplates] || workoutTemplates.resistance
  const splitName = template.splits[0]
  const days = []

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  // Get exercise categories
  const categories = Object.keys(template.exercises)

  for (let i = 0; i < trainingDays; i++) {
    const category = categories[i % categories.length]
    const categoryExercises = template.exercises[category as keyof typeof template.exercises]

    days.push({
      day: dayNames[i],
      focus: category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' '),
      exercises: categoryExercises,
    })
  }

  return {
    weeklySplit: splitName,
    days,
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await db.userProfile.findUnique({
      where: { id: 'default-profile' },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'No profile found. Please create a profile first.' },
        { status: 400 }
      )
    }

    // Get nutrition plan for target values
    const nutritionPlan = await db.nutritionPlan.findFirst({
      where: { profileId: profile.id },
    })

    if (!nutritionPlan) {
      return NextResponse.json(
        { error: 'No nutrition plan found. Please calculate your nutrition first.' },
        { status: 400 }
      )
    }

    // Generate meal plan
    const mealPlan = generateMealPlan(
      nutritionPlan.targetCalories,
      nutritionPlan.proteinGrams,
      nutritionPlan.carbsGrams,
      nutritionPlan.fatsGrams
    )

    // Save meal plan
    await db.nutritionPlan.update({
      where: { id: nutritionPlan.id },
      data: { mealPlan: JSON.stringify(mealPlan) },
    })

    // Generate workout plan
    const workoutPlan = generateWorkoutPlan(profile.trainingDays, profile.trainingType)

    // Save workout plan
    await db.workoutPlan.upsert({
      where: { id: 'default-workout' },
      update: {
        weeklySplit: workoutPlan.weeklySplit,
        workoutDays: JSON.stringify(workoutPlan.days),
      },
      create: {
        id: 'default-workout',
        profileId: profile.id,
        weeklySplit: workoutPlan.weeklySplit,
        workoutDays: JSON.stringify(workoutPlan.days),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error generating plan:', error)
    return NextResponse.json(
      { error: 'Failed to generate plan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
