'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Meal {
  name: string
  foods: { name: string; portion: string; calories: number; protein: number; carbs: number; fats: number }[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFats: number
}

interface MealPlan {
  meals: Meal[]
  dailyTotal: {
    calories: number
    protein: number
    carbs: number
    fats: number
  }
}

export default function MealPlanComponent() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMealPlan()
  }, [])

  const fetchMealPlan = async () => {
    try {
      const response = await fetch('/api/meal-plan')
      if (response.ok) {
        const data = await response.json()
        setMealPlan(data)
      }
    } catch (error) {
      console.error('Failed to fetch meal plan:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!mealPlan) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>No Meal Plan</CardTitle>
          <CardDescription>Generate your plan from the Dashboard</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Your Meal Plan</h2>
        <p className="text-muted-foreground">Structured nutrition plan with precise macro distribution</p>
      </div>

      {/* Daily Summary */}
      <Card className="bg-gradient-to-br from-gray-900/20 to-transparent dark:from-gray-800/30 dark:to-transparent border-border/50">
        <CardHeader>
          <CardTitle>Daily Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Calories</p>
              <p className="text-2xl font-bold">{Math.round(mealPlan.dailyTotal.calories)} kcal</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Protein</p>
              <p className="text-2xl font-bold">{Math.round(mealPlan.dailyTotal.protein)}g</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Carbs</p>
              <p className="text-2xl font-bold">{Math.round(mealPlan.dailyTotal.carbs)}g</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fats</p>
              <p className="text-2xl font-bold">{Math.round(mealPlan.dailyTotal.fats)}g</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals */}
      <div className="space-y-4">
        {mealPlan.meals.map((meal, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{meal.name}</CardTitle>
                <Badge variant="secondary">{Math.round(meal.totalCalories)} kcal</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meal.foods.map((food, idx) => (
                  <div key={idx} className="flex items-start justify-between p-3 bg-gradient-to-br from-gray-900/10 to-transparent dark:from-gray-800/20 dark:to-transparent rounded-lg">
                    <div>
                      <p className="font-medium">{food.name}</p>
                      <p className="text-sm text-muted-foreground">{food.portion}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p>{Math.round(food.calories)} kcal</p>
                      <p className="text-muted-foreground">
                        P: {Math.round(food.protein)}g • C: {Math.round(food.carbs)}g • F: {Math.round(food.fats)}g
                      </p>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                  <span className="text-muted-foreground">Meal Total</span>
                  <span className="font-medium">
                    {Math.round(meal.totalCalories)} kcal • 
                    P: {Math.round(meal.totalProtein)}g • 
                    C: {Math.round(meal.totalCarbs)}g • 
                    F: {Math.round(meal.totalFats)}g
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
