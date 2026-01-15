'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { User, Activity, Dumbbell, Utensils } from 'lucide-react'

interface ProfileData {
  age: number
  gender: string
  height: number
  currentWeight: number
  bodyFatPercent: number
  activityLevel: string
  dailySteps: number
  sleepDuration: number
  trainingDays: number
  trainingType: string
  primaryGoal: string
  dietaryStyle: string
  allergies: string
  fastingPattern: string
  culturalConstraints: string
  budget: string
}

const defaultProfile: ProfileData = {
  age: 30,
  gender: 'male',
  height: 175,
  currentWeight: 75,
  bodyFatPercent: 0,
  activityLevel: 'moderately_active',
  dailySteps: 8000,
  sleepDuration: 7.5,
  trainingDays: 4,
  trainingType: 'resistance',
  primaryGoal: 'general_fitness',
  dietaryStyle: 'balanced',
  allergies: '',
  fastingPattern: 'none',
  culturalConstraints: '',
  budget: 'medium',
}

export default function ProfileForm({ onProfileSaved }: { onProfileSaved: () => void }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (!response.ok) throw new Error('Failed to save profile')

      toast({
        title: 'Success',
        description: 'Profile saved successfully! You can now view your personalized plan.',
      })
      onProfileSaved()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save profile. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <CardTitle>Personal Information</CardTitle>
          </div>
          <CardDescription>
            Enter your personal details to calculate your nutritional needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                min="16"
                max="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={profile.gender} onValueChange={(v) => setProfile({ ...profile, gender: v })}>
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) })}
                min="100"
                max="250"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Current Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={profile.currentWeight}
                onChange={(e) => setProfile({ ...profile, currentWeight: parseFloat(e.target.value) })}
                min="30"
                max="300"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodyFat">Body Fat % (Optional)</Label>
              <Input
                id="bodyFat"
                type="number"
                value={profile.bodyFatPercent || ''}
                onChange={(e) => setProfile({ ...profile, bodyFatPercent: parseFloat(e.target.value) || 0 })}
                min="0"
                max="50"
                step="0.1"
                placeholder="Leave empty if unknown"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <CardTitle>Lifestyle & Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activityLevel">Activity Level</Label>
            <Select value={profile.activityLevel} onValueChange={(v) => setProfile({ ...profile, activityLevel: v })}>
              <SelectTrigger id="activityLevel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                <SelectItem value="lightly_active">Lightly active (1-3 days/week)</SelectItem>
                <SelectItem value="moderately_active">Moderately active (3-5 days/week)</SelectItem>
                <SelectItem value="highly_active">Highly active (6-7 days/week)</SelectItem>
                <SelectItem value="athlete">Athlete (very intense training daily)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dailySteps">Daily Steps (Optional)</Label>
              <Input
                id="dailySteps"
                type="number"
                value={profile.dailySteps}
                onChange={(e) => setProfile({ ...profile, dailySteps: parseInt(e.target.value) })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sleepDuration">Sleep Duration (hours)</Label>
              <Input
                id="sleepDuration"
                type="number"
                value={profile.sleepDuration}
                onChange={(e) => setProfile({ ...profile, sleepDuration: parseFloat(e.target.value) })}
                min="0"
                max="24"
                step="0.5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            <CardTitle>Training Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trainingDays">Training Days/Week</Label>
              <Select value={profile.trainingDays.toString()} onValueChange={(v) => setProfile({ ...profile, trainingDays: parseInt(v) })}>
                <SelectTrigger id="trainingDays">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                    <SelectItem key={days} value={days.toString()}>{days} day{days > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingType">Training Type</Label>
              <Select value={profile.trainingType} onValueChange={(v) => setProfile({ ...profile, trainingType: v })}>
                <SelectTrigger id="trainingType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resistance">Resistance Training (Gym)</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="crossfit">CrossFit / HIIT</SelectItem>
                  <SelectItem value="home">Home Workouts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryGoal">Primary Goal</Label>
              <Select value={profile.primaryGoal} onValueChange={(v) => setProfile({ ...profile, primaryGoal: v })}>
                <SelectTrigger id="primaryGoal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="hypertrophy">Hypertrophy (Muscle Gain)</SelectItem>
                  <SelectItem value="fat_loss">Fat Loss</SelectItem>
                  <SelectItem value="general_fitness">General Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            <CardTitle>Nutrition Preferences</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dietaryStyle">Dietary Style</Label>
              <Select value={profile.dietaryStyle} onValueChange={(v) => setProfile({ ...profile, dietaryStyle: v })}>
                <SelectTrigger id="dietaryStyle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="low_carb">Low Carb</SelectItem>
                  <SelectItem value="high_protein">High Protein</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="keto">Ketogenic</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fastingPattern">Fasting Pattern</Label>
              <Select value={profile.fastingPattern} onValueChange={(v) => setProfile({ ...profile, fastingPattern: v })}>
                <SelectTrigger id="fastingPattern">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="intermittent_16_8">16:8 Intermittent</SelectItem>
                  <SelectItem value="intermittent_18_6">18:6 Intermittent</SelectItem>
                  <SelectItem value="omad">OMAD (One Meal A Day)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select value={profile.budget} onValueChange={(v) => setProfile({ ...profile, budget: v })}>
                <SelectTrigger id="budget">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="culturalConstraints">Cultural/Religious Constraints</Label>
              <Input
                id="culturalConstraints"
                placeholder="e.g., Halal, Kosher"
                value={profile.culturalConstraints}
                onChange={(e) => setProfile({ ...profile, culturalConstraints: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies & Exclusions</Label>
            <Textarea
              id="allergies"
              placeholder="List any food allergies or items to exclude..."
              value={profile.allergies}
              onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading} className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700">
          {loading ? 'Saving...' : 'Save Profile & Generate Plan'}
        </Button>
      </div>
    </motion.div>
  )
}
