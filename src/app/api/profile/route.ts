import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function ensureUserExists() {
  const user = await db.user.findFirst()
  if (!user) {
    await db.user.create({
      data: {
        email: 'user@example.com',
        name: 'User',
      },
    })
    return await db.user.findFirst()
  }
  return user
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const user = await ensureUserExists()

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Create or update user profile
    const profile = await db.userProfile.upsert({
      where: { id: 'default-profile' },
      update: {
        age: body.age,
        gender: body.gender,
        height: body.height,
        currentWeight: body.currentWeight,
        bodyFatPercent: body.bodyFatPercent || null,
        activityLevel: body.activityLevel,
        dailySteps: body.dailySteps || null,
        sleepDuration: body.sleepDuration || null,
        trainingDays: body.trainingDays,
        trainingType: body.trainingType,
        primaryGoal: body.primaryGoal,
        dietaryStyle: body.dietaryStyle,
        allergies: body.allergies || null,
        fastingPattern: body.fastingPattern,
        culturalConstraints: body.culturalConstraints || null,
        budget: body.budget,
      },
      create: {
        id: 'default-profile',
        userId: user.id,
        age: body.age,
        gender: body.gender,
        height: body.height,
        currentWeight: body.currentWeight,
        bodyFatPercent: body.bodyFatPercent || null,
        activityLevel: body.activityLevel,
        dailySteps: body.dailySteps || null,
        sleepDuration: body.sleepDuration || null,
        trainingDays: body.trainingDays,
        trainingType: body.trainingType,
        primaryGoal: body.primaryGoal,
        dietaryStyle: body.dietaryStyle,
        allergies: body.allergies || null,
        fastingPattern: body.fastingPattern,
        culturalConstraints: body.culturalConstraints || null,
        budget: body.budget,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const profile = await db.userProfile.findUnique({
      where: { id: 'default-profile' },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
