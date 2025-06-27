"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, User, Trophy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Quiz {
  id: string
  title: string
  description: string | null
  time_limit: number
  created_by: string
  created_at: string
}

interface QuizDashboardProps {
  user: any
  onCreateQuiz: () => void
  onTakeQuiz: (quiz: Quiz) => void
}

export function QuizDashboard({ user, onCreateQuiz, onTakeQuiz }: QuizDashboardProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setQuizzes(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch quizzes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">QuizMaster Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.email}!</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onCreateQuiz} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Quiz
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{quiz.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {quiz.description || "No description available"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {quiz.time_limit} min
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {quiz.created_by === user.id ? "You" : "Other"}
                  </Badge>
                </div>
                <Button onClick={() => onTakeQuiz(quiz)} className="w-full flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Take Quiz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No quizzes yet</h3>
            <p className="text-gray-600 mb-4">Be the first to create a quiz!</p>
            <Button onClick={onCreateQuiz} className="flex items-center gap-2 mx-auto">
              <Plus className="h-4 w-4" />
              Create Your First Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
