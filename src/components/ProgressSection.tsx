'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, Loader2, Plus } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface ProgressEntry {
  id: string
  weight: number
  bodyFatPercent?: number
  date: string
  notes?: string
}

export default function ProgressSection() {
  const [progress, setProgress] = useState<ProgressEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [newWeight, setNewWeight] = useState('')
  const [newBodyFat, setNewBodyFat] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/progress')
      if (response.ok) {
        const data = await response.json()
        setProgress(data)
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const addProgress = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: parseFloat(newWeight),
          bodyFatPercent: newBodyFat ? parseFloat(newBodyFat) : undefined,
          notes: newNotes,
        }),
      })

      if (!response.ok) throw new Error('Failed to add progress')

      toast({ title: 'Success', description: 'Progress logged successfully' })
      setNewWeight('')
      setNewBodyFat('')
      setNewNotes('')
      await fetchProgress()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to log progress', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  const chartData = progress
    .map((p) => ({
      date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: p.weight,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-12)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Progress Tracking</h2>
        <p className="text-muted-foreground">Track your weight and body composition over time</p>
      </div>

      {/* Weight Chart */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Weight Trend</CardTitle>
          <CardDescription>Last 12 entries</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} className="text-xs" />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-12">No data yet. Log your first entry below.</p>
          )}
        </CardContent>
      </Card>

      {/* Log New Progress */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <CardTitle>Log New Progress</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={addProgress} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="75.5"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodyFat">Body Fat % (Optional)</Label>
              <Input
                id="bodyFat"
                type="number"
                step="0.1"
                value={newBodyFat}
                onChange={(e) => setNewBodyFat(e.target.value)}
                placeholder="18.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="How are you feeling?"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Calendar className="w-4 h-4 mr-2" />}
                Log Progress
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Progress History */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {progress.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No entries yet</p>
            ) : (
              progress
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gradient-to-br from-gray-900/10 to-transparent dark:from-gray-800/20 dark:to-transparent rounded-lg">
                    <div>
                      <p className="font-medium">{entry.weight} kg</p>
                      {entry.bodyFatPercent && (
                        <p className="text-sm text-muted-foreground">{entry.bodyFatPercent}% body fat</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{new Date(entry.date).toLocaleDateString()}</p>
                      {entry.notes && <p className="text-xs text-muted-foreground">{entry.notes}</p>}
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
