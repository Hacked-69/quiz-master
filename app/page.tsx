"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { AuthForm } from "@/components/auth-form"
import { QuizDashboard } from "@/components/quiz-dashboard"
import { QuizCreator } from "@/components/quiz-creator"
import { QuizTaker } from "@/components/quiz-taker"
import { Toaster } from "@/components/ui/toaster"

type View = "dashboard" | "create" | "take"

interface Quiz {
  id: string
  title: string
  description: string | null
  time_limit: number
  created_by: string
  created_at: string
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<View>("dashboard")
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <AuthForm />
        <Toaster />
      </>
    )
  }

  const handleCreateQuiz = () => {
    setCurrentView("create")
  }

  const handleTakeQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setCurrentView("take")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedQuiz(null)
  }

  return (
    <>
      {currentView === "dashboard" && (
        <QuizDashboard user={user} onCreateQuiz={handleCreateQuiz} onTakeQuiz={handleTakeQuiz} />
      )}
      {currentView === "create" && <QuizCreator user={user} onBack={handleBackToDashboard} />}
      {currentView === "take" && selectedQuiz && (
        <QuizTaker quiz={selectedQuiz} user={user} onBack={handleBackToDashboard} />
      )}
      <Toaster />
    </>
  )
}
