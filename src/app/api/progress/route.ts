import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { weight, bodyFatPercent, notes } = body

    const profile = await db.userProfile.findFirst()

    if (!profile) {
      return NextResponse.json(
        { error: 'No profile found. Please create a profile first.' },
        { status: 400 }
      )
    }

    const entry = await db.progressEntry.create({
      data: {
        profileId: profile.id,
        weight,
        bodyFatPercent: bodyFatPercent || null,
        date: new Date(),
        notes: notes || null,
      },
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Error adding progress:', error)
    return NextResponse.json(
      { error: 'Failed to add progress' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const profile = await db.userProfile.findFirst()

    if (!profile) {
      return NextResponse.json([])
    }

    const entries = await db.progressEntry.findMany({
      where: { profileId: profile.id },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}
