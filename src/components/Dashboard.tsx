'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Download, Loader2, Zap, Flame, Target, Dumbbell, Apple, Droplets } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface NutritionData {
  bmr: number
  tdee: number
  targetCalories: number
  proteinGrams: number
  carbsGrams: number
  fatsGrams: number
  proteinPercent: number
  carbsPercent: number
  fatsPercent: number
}

const StatCard = ({ icon: Icon, title, value, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.05 }}
  >
    <Card className="bg-gradient-to-br from-gray-900/40 to-gray-800/30 dark:from-gray-800/50 dark:to-gray-900/40 border-border/50 backdrop-blur-sm h-full">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5 text-foreground/70" />
          <CardDescription>{title}</CardDescription>
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {Math.round(value)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
)

export default function Dashboard() {
  const [nutrition, setNutrition] = useState<NutritionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchNutritionData()
  }, [])

  const fetchNutritionData = async () => {
    try {
      const response = await fetch('/api/nutrition')
      if (response.ok) {
        const data = await response.json()
        setNutrition(data)
      }
    } catch (error) {
      console.error('Failed to fetch nutrition data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePlan = async () => {
    try {
      const response = await fetch('/api/generate-plan', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to generate plan')

      const data = await response.json()
      if (data.success) {
        toast({ title: 'Success', description: 'Meal and workout plans generated!' })
        await fetchNutritionData()
      }
    } catch (error) {
      console.error('Error generating plan:', error)
      toast({ title: 'Error', description: 'Failed to generate plan. Please try again.', variant: 'destructive' })
    }
  }

  const downloadPDF = async () => {
    setDownloading(true)
    try {
      const [profileRes, nutritionRes, mealPlanRes, workoutPlanRes, progressRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/nutrition'),
        fetch('/api/meal-plan'),
        fetch('/api/workout-plan'),
        fetch('/api/progress'),
      ])

      const profile = await profileRes.json()
      const nutritionData = await nutritionRes.json()
      const mealPlan = await mealPlanRes.json()
      const workoutPlan = await workoutPlanRes.json()
      const progress = await progressRes.json()

      if (!profile || !nutritionData) {
        throw new Error('Missing required data for PDF generation')
      }

      const htmlContent = generatePDFHTML(profile, nutritionData, mealPlan, workoutPlan, progress)

      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mn-smart-nutrition-${new Date().toISOString().split('T')[0]}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: 'PDF Generated Successfully',
        description: 'Your plan has been exported. Open in browser and print to PDF.'
      })
    } catch (error) {
      console.error('PDF generation error:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setDownloading(false)
    }
  }

  function generatePDFHTML(profile: any, nutrition: any, mealPlan: any, workoutPlan: any, progress: any) {
    const dateStr = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MN Smart Nutrition - Personalized Plan</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%);
            color: #e5e5e5;
            line-height: 1.6;
            min-height: 100vh;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 60px 40px;
            background: rgba(20, 20, 20, 0.95);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .header {
            text-align: center;
            margin-bottom: 60px;
            padding-bottom: 40px;
            border-bottom: 2px solid #333;
        }
        .logo {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 48px;
            font-weight: 700;
            background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 15px;
        }
        .subtitle {
            font-size: 14px;
            color: #666;
            font-weight: 400;
            letter-spacing: 3px;
            text-transform: uppercase;
        }
        .date {
            margin-top: 20px;
            color: #555;
            font-size: 13px;
        }
        h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 36px;
            font-weight: 700;
            color: #ffffff;
            margin: 40px 0 25px 0;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        h1::before {
            content: '';
            width: 4px;
            height: 36px;
            background: linear-gradient(180deg, #ffffff 0%, #666 100%);
            border-radius: 2px;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
            margin: 30px 0;
        }
        .metric-card {
            background: linear-gradient(145deg, #1a1a1a 0%, #252525 100%);
            border: 1px solid #333;
            border-radius: 16px;
            padding: 30px 25px;
            text-align: center;
        }
        .metric-value {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 42px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
        }
        .metric-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .macros-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 30px 0;
        }
        .macro-card {
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 25px 20px;
            text-align: center;
        }
        .macro-name {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 18px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 12px;
        }
        .macro-value {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 36px;
            font-weight: 700;
            color: #ffffff;
        }
        .footer {
            margin-top: 60px;
            padding-top: 40px;
            border-top: 1px solid #333;
            text-align: center;
        }
        .footer-credit {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 14px;
            color: #888;
            font-weight: 500;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            background: #333;
            border-radius: 20px;
            font-size: 11px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-left: 10px;
        }
        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">MN Smart Nutrition</div>
            <div class="subtitle">Precision Nutrition & Fitness Tracking</div>
            <div class="date">Generated on ${dateStr}</div>
        </div>

        ${nutrition ? `
        <h1>Calorie Targets <span class="badge">Daily</span></h1>

        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-value">${Math.round(nutrition.bmr)}</div>
                <div class="metric-label">BMR (kcal)</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${Math.round(nutrition.tdee)}</div>
                <div class="metric-label">TDEE (kcal)</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${Math.round(nutrition.targetCalories)}</div>
                <div class="metric-label">Target (kcal)</div>
            </div>
        </div>

        <h1>Macronutrient Distribution</h1>

        <div class="macros-grid">
            <div class="macro-card">
                <div class="macro-name">Protein</div>
                <div class="macro-value">${Math.round(nutrition.proteinGrams)}g</div>
            </div>
            <div class="macro-card">
                <div class="macro-name">Carbohydrates</div>
                <div class="macro-value">${Math.round(nutrition.carbsGrams)}g</div>
            </div>
            <div class="macro-card">
                <div class="macro-name">Fats</div>
                <div class="macro-value">${Math.round(nutrition.fatsGrams)}g</div>
            </div>
        </div>
        ` : ''}

        ${mealPlan && mealPlan.meals ? `
        <h1>Meal Plan</h1>
        ${mealPlan.meals.map((meal: any) => `
            <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 10px; padding: 20px; margin: 15px 0;">
                <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 15px;">${meal.name}</h3>
                ${meal.foods.map((food: any) => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2a2a2a;">
                        <span style="color: #ccc;">${food.portion} ${food.name}</span>
                        <span style="color: #666; font-size: 12px;">${Math.round(food.calories)} kcal</span>
                    </div>
                `).join('')}
            </div>
        `).join('')}
        ` : ''}

        <div class="footer">
            <p class="footer-credit">Created by Mohammed Nasser - Software Development Engineer</p>
        </div>
    </div>
</body>
</html>`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!nutrition) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>No Profile Found</CardTitle>
          <CardDescription>Please complete your profile first</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Your Nutrition Dashboard</h2>
          <p className="text-muted-foreground">Track your daily nutrition targets and macros</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={generatePlan}
            className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800"
          >
            Generate Plan
          </Button>
          <Button
            onClick={downloadPDF}
            disabled={downloading}
            variant="outline"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Flame} title="BMR" value={nutrition.bmr} description="Basal Metabolic Rate" delay={0.1} />
        <StatCard icon={Zap} title="TDEE" value={nutrition.tdee} description="Total Daily Energy Expenditure" delay={0.2} />
        <StatCard icon={Target} title="Target Calories" value={nutrition.targetCalories} description="Daily calorie goal" delay={0.3} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-gray-900/40 to-gray-800/30 dark:from-gray-800/50 dark:to-gray-900/40 border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Macronutrient Breakdown</CardTitle>
            <CardDescription>Your daily macro targets for optimal performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <motion.div className="space-y-2" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Protein</span>
                  <Badge variant="secondary">{Math.round(nutrition.proteinPercent)}%</Badge>
                </div>
                <p className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{Math.round(nutrition.proteinGrams)}g</p>
                <Progress value={nutrition.proteinPercent} className="h-2" />
                <p className="text-xs text-muted-foreground">Building and repairing muscle tissue</p>
              </motion.div>

              <motion.div className="space-y-2" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Carbohydrates</span>
                  <Badge variant="secondary">{Math.round(nutrition.carbsPercent)}%</Badge>
                </div>
                <p className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{Math.round(nutrition.carbsGrams)}g</p>
                <Progress value={nutrition.carbsPercent} className="h-2" />
                <p className="text-xs text-muted-foreground">Primary energy source for training</p>
              </motion.div>

              <motion.div className="space-y-2" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Fats</span>
                  <Badge variant="secondary">{Math.round(nutrition.fatsPercent)}%</Badge>
                </div>
                <p className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{Math.round(nutrition.fatsGrams)}g</p>
                <Progress value={nutrition.fatsPercent} className="h-2" />
                <p className="text-xs text-muted-foreground">Hormonal health and nutrient absorption</p>
              </motion.div>
            </div>

            <motion.div
              className="bg-gradient-to-br from-gray-900/20 to-transparent dark:from-gray-800/30 dark:to-transparent rounded-lg p-4 border border-border/50 mt-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm">
                <span className="font-semibold">Method:</span> Calculated using Mifflin-St Jeor equation
                with activity and goal adjustments. All values are estimates and should be adjusted based
                on your progress and response.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-gray-900/40 to-gray-800/30 dark:from-gray-800/50 dark:to-gray-900/40 border-border/50 backdrop-blur-sm rounded-lg p-4 text-center"
        >
          <Dumbbell className="w-6 h-6 mx-auto mb-2 text-foreground/70" />
          <p className="text-xs text-muted-foreground">Daily Protein</p>
          <p className="text-lg font-bold">{Math.round(nutrition.proteinGrams)}g</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-gray-900/40 to-gray-800/30 dark:from-gray-800/50 dark:to-gray-900/40 border-border/50 backdrop-blur-sm rounded-lg p-4 text-center"
        >
          <Apple className="w-6 h-6 mx-auto mb-2 text-foreground/70" />
          <p className="text-xs text-muted-foreground">Daily Carbs</p>
          <p className="text-lg font-bold">{Math.round(nutrition.carbsGrams)}g</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-gray-900/40 to-gray-800/30 dark:from-gray-800/50 dark:to-gray-900/40 border-border/50 backdrop-blur-sm rounded-lg p-4 text-center"
        >
          <Droplets className="w-6 h-6 mx-auto mb-2 text-foreground/70" />
          <p className="text-xs text-muted-foreground">Daily Fats</p>
          <p className="text-lg font-bold">{Math.round(nutrition.fatsGrams)}g</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-gray-900/40 to-gray-800/30 dark:from-gray-800/50 dark:to-gray-900/40 border-border/50 backdrop-blur-sm rounded-lg p-4 text-center"
        >
          <Flame className="w-6 h-6 mx-auto mb-2 text-foreground/70" />
          <p className="text-xs text-muted-foreground">Calorie Goal</p>
          <p className="text-lg font-bold">{Math.round(nutrition.targetCalories)}</p>
        </motion.div>
      </div>
    </div>
  )
}
