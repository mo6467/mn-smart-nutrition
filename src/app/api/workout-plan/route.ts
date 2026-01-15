import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

export async function GET() {
  try {
    const profile = await db.userProfile.findUnique({
      where: { id: 'default-profile' },
    })

    if (!profile) {
      return NextResponse.json(null)
    }

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

    return NextResponse.json(workoutPlan)
  } catch (error) {
    console.error('Error generating workout plan:', error)
    return NextResponse.json(
      { error: 'Failed to generate workout plan' },
      { status: 500 }
    )
  }
}
