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
    {
      name: 'Turkey & Rice Bowl',
      foods: [
        { name: 'Ground Turkey', portion: '150g', calories: 200, protein: 30, carbs: 0, fats: 8 },
        { name: 'Brown Rice', portion: '150g cooked', calories: 165, protein: 4, carbs: 34, fats: 1 },
        { name: 'Mixed Vegetables', portion: '150g', calories: 50, protein: 2, carbs: 10, fats: 0.5 },
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
    {
      name: 'Beef Stir Fry',
      foods: [
        { name: 'Lean Beef Strips', portion: '150g', calories: 240, protein: 32, carbs: 0, fats: 10 },
        { name: 'Mixed Vegetables', portion: '200g', calories: 70, protein: 3, carbs: 12, fats: 0.8 },
        { name: 'Brown Rice', portion: '100g cooked', calories: 110, protein: 2.5, carbs: 23, fats: 1 },
        { name: 'Soy Sauce', portion: '2 tbsp', calories: 18, protein: 2, carbs: 1.5, fats: 0 },
      ],
    },
    {
      name: 'Chicken & Pasta',
      foods: [
        { name: 'Chicken Breast', portion: '150g', calories: 248, protein: 46, carbs: 0, fats: 5.5 },
        { name: 'Whole Wheat Pasta', portion: '100g cooked', calories: 174, protein: 7.5, carbs: 37, fats: 0.8 },
        { name: 'Tomato Sauce', portion: '100g', calories: 70, protein: 2, carbs: 12, fats: 2 },
        { name: 'Parmesan', portion: '20g', calories: 80, protein: 7, carbs: 0.5, fats: 5 },
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
    {
      name: 'Apple & Peanut Butter',
      foods: [
        { name: 'Apple', portion: '1 medium', calories: 95, protein: 0.5, carbs: 25, fats: 0.3 },
        { name: 'Peanut Butter', portion: '1 tbsp', calories: 90, protein: 4, carbs: 3, fats: 8 },
      ],
    },
  ],
}

function generateMealPlan(targetCalories: number, protein: number, carbs: number, fats: number) {
  const caloriePerMeal = targetCalories / 4

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

export async function GET() {
  try {
    const nutritionPlan = await db.nutritionPlan.findFirst()

    if (!nutritionPlan) {
      return NextResponse.json(null)
    }

    const mealPlan = generateMealPlan(
      nutritionPlan.targetCalories,
      nutritionPlan.proteinGrams,
      nutritionPlan.carbsGrams,
      nutritionPlan.fatsGrams
    )

    // Update the nutrition plan with the meal plan
    await db.nutritionPlan.update({
      where: { id: nutritionPlan.id },
      data: { mealPlan: JSON.stringify(mealPlan) },
    })

    return NextResponse.json(mealPlan)
  } catch (error) {
    console.error('Error generating meal plan:', error)
    return NextResponse.json(
      { error: 'Failed to generate meal plan' },
      { status: 500 }
    )
  }
}
