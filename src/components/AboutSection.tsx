'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Code, Database, Brain, FlaskConical, Sparkles, Award, Rocket } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
}

const SkillBadge = ({ icon: Icon, label, index }: any) => (
  <motion.div
    variants={item}
    whileHover={{ 
      scale: 1.1, 
      rotate: [-2, 2],
      boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.3)' 
    }}
    transition={{ duration: 0.3 }}
  >
    <Badge
      variant="secondary"
      className="px-4 py-2 text-sm gap-2 bg-gradient-to-r from-gray-900/50 to-gray-800/30 dark:from-gray-800/50 dark:to-gray-900/30 cursor-pointer border border-border/30 transition-all duration-300"
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </Badge>
  </motion.div>
)

export default function AboutSection() {
  const expertise = [
    { icon: Code, label: 'Java & Python' },
    { icon: Database, label: 'Backend Systems' },
    { icon: Brain, label: 'AGI/LLM Research' },
    { icon: FlaskConical, label: 'Applied Mathematics' },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto"
    >
      <motion.div variants={item}>
        <Card className="bg-gradient-to-br from-gray-900/30 to-gray-800/20 dark:from-gray-800/40 dark:to-gray-900/30 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden">
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-5"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, transparent 75%, transparent)',
              backgroundSize: '400% 400%',
            }}
          />
          
          <CardHeader className="relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Award className="w-6 h-6 text-foreground/80" />
                </motion.div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  About the Software Engineer
                </CardTitle>
              </div>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            {/* Photo Section */}
            <motion.div variants={item} className="flex flex-col md:flex-row gap-6 items-start">
              <motion.div 
                className="relative w-48 h-48 mx-auto md:mx-0 flex-shrink-0"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 blur-lg opacity-40 animate-pulse" />
                <motion.div
                  className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-border/50 bg-background"
                  whileHover={{ boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)' }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/my-photo.jpg"
                    alt="Software Engineer"
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </motion.div>

              {/* Professional Brief */}
              <div className="flex-1 space-y-4">
                <motion.div
                  variants={item}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-foreground/70" />
                    Software Engineer & AI Researcher
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Expertise in Java and Python, delivering scalable, high-performance backend systems, 
                    AML and regulatory compliance platforms, and enterprise-grade REST APIs.
                  </p>
                </motion.div>
                <motion.div
                  variants={item}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-foreground/70" />
                    AI & Research Background
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Strong background in AGI/LLM research engineering and applied mathematics, 
                    with a focus on rigorous reasoning, formal verification, and large-scale data 
                    and evaluation pipelines.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Expertise Badges */}
            <motion.div variants={item}>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Core Expertise
              </h4>
              <div className="flex flex-wrap gap-3">
                {expertise.map((skill, index) => {
                  const Icon = skill.icon
                  return <SkillBadge key={index} icon={Icon} label={skill.label} index={index} />
                })}
              </div>
            </motion.div>

            {/* Vision Statement */}
            <motion.div 
              variants={item}
              className="bg-gradient-to-br from-gray-900/30 to-transparent dark:from-gray-800/40 dark:to-transparent rounded-lg p-6 border border-border/50 relative overflow-hidden"
              whileHover={{ scale: 1.02, boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.25)' }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 opacity-10"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)',
                }}
              />
              <p className="text-sm leading-relaxed relative">
                <span className="font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Project Vision:</span> To build a robust, intelligent fitness and 
                nutrition platform that enables users to manage diet, training, and body composition with scientific 
                rigor, professional quality, and full personal control—without hype, dependency, or unsafe practices.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
