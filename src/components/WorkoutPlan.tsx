'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface WorkoutDay {
  day: string
  focus: string
  exercises: { name: string; sets: number; reps: string; rest: string }[]
}

interface WorkoutPlan {
  weeklySplit: string
  days: WorkoutDay[]
}

export default function WorkoutPlanComponent() {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkoutPlan()
  }, [])

  const fetchWorkoutPlan = async () => {
    try {
      const response = await fetch('/api/workout-plan')
      if (response.ok) {
        const data = await response.json()
        setWorkoutPlan(data)
      }
    } catch (error) {
      console.error('Failed to fetch workout plan:', error)
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

  if (!workoutPlan) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>No Workout Plan</CardTitle>
          <CardDescription>Generate your plan from the Dashboard</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Your Workout Plan</h2>
        <p className="text-muted-foreground">{workoutPlan.weeklySplit}</p>
      </div>

      <div className="grid gap-4">
        {workoutPlan.days.map((day, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{day.day}</CardTitle>
                <Badge variant="secondary">{day.focus}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {day.exercises.map((exercise, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gradient-to-br from-gray-900/10 to-transparent dark:from-gray-800/20 dark:to-transparent rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{exercise.name}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">{exercise.sets} × {exercise.reps}</p>
                      <p className="text-muted-foreground">Rest: {exercise.rest}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
