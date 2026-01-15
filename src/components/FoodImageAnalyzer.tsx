'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Camera, Loader2, Utensils } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface FoodAnalysis {
  items: {
    name: string
    calories: number
    protein: number
    carbs: number
    fats: number
  }[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFats: number
}

export default function FoodImageAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAnalyzing(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to analyze image')

      const data = await response.json()
      setAnalysis(data)
      toast({ title: 'Success', description: 'Food image analyzed!' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to analyze food image', variant: 'destructive' })
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Food Image Analysis</h2>
        <p className="text-muted-foreground">Upload a food image to get instant nutritional information</p>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Upload Food Image</CardTitle>
          <CardDescription>AI-powered food recognition and nutrition estimation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-border transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={analyzing}
              className="hidden"
              id="food-image-input"
            />
            <label htmlFor="food-image-input" className="cursor-pointer">
              <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {analyzing ? 'Analyzing...' : 'Click to upload or drag and drop'}
              </p>
            </label>
          </div>

          {analyzing && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Analyzing food image...</span>
            </div>
          )}

          {analysis && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-gray-900/20 to-transparent dark:from-gray-800/30 dark:to-transparent rounded-lg p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Utensils className="w-5 h-5" />
                  <h3 className="font-semibold">Analysis Results</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Calories</p>
                    <p className="text-xl font-bold">{Math.round(analysis.totalCalories)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Protein</p>
                    <p className="text-xl font-bold">{Math.round(analysis.totalProtein)}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                    <p className="text-xl font-bold">{Math.round(analysis.totalCarbs)}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fats</p>
                    <p className="text-xl font-bold">{Math.round(analysis.totalFats)}g</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Detected Items</h4>
                {analysis.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-br from-gray-900/10 to-transparent dark:from-gray-800/20 dark:to-transparent rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round(item.calories)} kcal • 
                        P: {Math.round(item.protein)}g • 
                        C: {Math.round(item.carbs)}g • 
                        F: {Math.round(item.fats)}g
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
