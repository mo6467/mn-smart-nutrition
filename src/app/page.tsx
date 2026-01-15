'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, Apple, Dumbbell, TrendingUp, User, FileText, Camera, BarChart3, Moon, Sun, Code, Sparkles } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'

// Components for each section
import AboutSection from '@/components/AboutSection'
import ProfileForm from '@/components/ProfileForm'
import Dashboard from '@/components/Dashboard'
import MealPlan from '@/components/MealPlan'
import WorkoutPlan from '@/components/WorkoutPlan'
import ProgressSection from '@/components/ProgressSection'
import FoodImageAnalyzer from '@/components/FoodImageAnalyzer'

export default function Home() {
  const [activeTab, setActiveTab] = useState('about')
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black dark:from-gray-950 dark:via-gray-900 dark:to-black bg-gradient-to-br from-gray-100 via-gray-50 to-white" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-gray-800/30 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0, -100, 0],
            y: [0, -50, 100, 50, 0],
            scale: [1, 1.2, 1, 0.8, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tl from-gray-700/30 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0, 100, 0],
            y: [0, 100, -50, -100, 0],
            scale: [1, 0.8, 1.2, 1, 0.8],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-gray-900/20 to-transparent rounded-full blur-3xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gray-700/50 dark:bg-gray-400/30 rounded-full"
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-xl bg-background/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Activity className="w-6 h-6 text-foreground" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    MN Smart Nutrition
                  </h1>
                  <p className="text-xs text-muted-foreground">Precision Nutrition & Fitness Tracking</p>
                </div>
              </motion.div>
              <div className="flex items-center gap-3">
                <motion.div
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-full border border-border/30"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Code className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Mohammed Nasser</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="rounded-full hover:bg-white/10 transition-all duration-300"
                  >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto gap-2 bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl p-1">
                {[
                  { value: 'about', icon: User, label: 'About' },
                  { value: 'profile', icon: Activity, label: 'Profile' },
                  { value: 'dashboard', icon: BarChart3, label: 'Dashboard' },
                  { value: 'meal-plan', icon: Apple, label: 'Meal Plan' },
                  { value: 'workout', icon: Dumbbell, label: 'Workout' },
                  { value: 'progress', icon: TrendingUp, label: 'Progress' },
                  { value: 'food-ai', icon: Camera, label: 'Food AI' },
                ].map((tab, index) => {
                  const Icon = tab.icon
                  return (
                    <TabsTrigger 
                      key={tab.value}
                      value={tab.value} 
                      className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-gray-900/90 data-[state=active]:to-gray-800/90 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <motion.div
                        initial={{ rotate: -180 }}
                        animate={{ rotate: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <Icon className="w-4 h-4" />
                      </motion.div>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-6"
              >
                <TabsContent value="about">
                  <AboutSection />
                </TabsContent>

                <TabsContent value="profile">
                  <ProfileForm onProfileSaved={() => setActiveTab('dashboard')} />
                </TabsContent>

                <TabsContent value="dashboard">
                  <Dashboard />
                </TabsContent>

                <TabsContent value="meal-plan">
                  <MealPlan />
                </TabsContent>

                <TabsContent value="workout">
                  <WorkoutPlan />
                </TabsContent>

                <TabsContent value="progress">
                  <ProgressSection />
                </TabsContent>

                <TabsContent value="food-ai">
                  <FoodImageAnalyzer />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t border-border/50 backdrop-blur-xl bg-background/30 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col items-center md:items-start gap-2">
                <p className="text-sm text-muted-foreground text-center md:text-left">
                  © 2025 MN Smart Nutrition. Scientific nutrition & fitness tracking.
                </p>
                <p className="text-xs text-muted-foreground">
                  This platform provides information only and does not constitute medical advice.
                </p>
              </div>
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-full border border-border/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground font-medium">Created by Mohammed Nasser</span>
                <span className="text-xs text-muted-foreground">Software Development Engineer</span>
              </motion.div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
