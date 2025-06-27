"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Clock,
  User,
  Trophy,
  History,
  Brain,
  Zap,
  Target,
  Star,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Sparkles,
} from "lucide-react"
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
  onViewAttempts: () => void
}

export function QuizDashboard({ user, onCreateQuiz, onTakeQuiz, onViewAttempts }: QuizDashboardProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [recentAttempts, setRecentAttempts] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchQuizzes()
    fetchRecentAttempts()
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

  const fetchRecentAttempts = async () => {
    try {
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select(`
          *,
          quizzes!inner(title)
        `)
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(3)

      if (error) throw error
      setRecentAttempts(data || [])
    } catch (error: any) {
      console.error("Failed to fetch recent attempts:", error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const getQuizIcon = (index: number) => {
    const icons = [Brain, Zap, Target, Star, BookOpen, Award]
    const Icon = icons[index % icons.length]
    return Icon
  }

  const getQuizGradient = (index: number) => {
    const gradients = [
      "from-pink-500 to-rose-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-purple-500 to-violet-500",
      "from-orange-500 to-amber-500",
      "from-indigo-500 to-blue-500",
    ]
    return gradients[index % gradients.length]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500 mx-auto"></div>
            <Brain className="absolute inset-0 m-auto h-6 w-6 text-purple-400 animate-pulse" />
          </div>
          <p className="mt-4 text-gray-300 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Welcome Back!
                </h1>
                <p className="text-gray-400 text-lg mt-1">Ready to challenge your mind, {user.email?.split("@")[0]}?</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={onCreateQuiz}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Quiz
            </Button>
            <Button
              variant="outline"
              onClick={onViewAttempts}
              className="border-2 border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 font-semibold px-6 py-3 rounded-xl backdrop-blur-sm transition-all"
            >
              <History className="h-5 w-5 mr-2" />
              My Progress
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-2 border-gray-500/50 bg-gray-500/10 hover:bg-gray-500/20 text-gray-300 hover:text-gray-200 font-semibold px-6 py-3 rounded-xl backdrop-blur-sm transition-all"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-pink-500/30 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-300 text-sm font-medium">Available Quizzes</p>
                  <p className="text-3xl font-bold text-white">{quizzes.length}</p>
                </div>
                <div className="p-3 bg-pink-500/30 rounded-xl">
                  <BookOpen className="h-6 w-6 text-pink-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium">Your Attempts</p>
                  <p className="text-3xl font-bold text-white">{recentAttempts.length}</p>
                </div>
                <div className="p-3 bg-blue-500/30 rounded-xl">
                  <Target className="h-6 w-6 text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium">Avg. Score</p>
                  <p className="text-3xl font-bold text-white">
                    {recentAttempts.length > 0
                      ? Math.round(
                          (recentAttempts.reduce((sum, attempt) => sum + attempt.score, 0) /
                            recentAttempts.reduce((sum, attempt) => sum + attempt.total_questions, 0)) *
                            100,
                        ) || 0
                      : 0}
                    %
                  </p>
                </div>
                <div className="p-3 bg-green-500/30 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/30 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Active Users</p>
                  <p className="text-3xl font-bold text-white">2.4K</p>
                </div>
                <div className="p-3 bg-purple-500/30 rounded-xl">
                  <Users className="h-6 w-6 text-purple-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Available Quizzes */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-yellow-400" />
                Available Quizzes
              </h2>
              <Badge className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-3 py-1">
                {quizzes.length} Total
              </Badge>
            </div>

            {quizzes.length === 0 ? (
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardContent className="text-center py-16">
                  <div className="p-4 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full w-fit mx-auto mb-6">
                    <Trophy className="h-16 w-16 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">No quizzes yet</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Be the pioneer! Create the first quiz and start the learning revolution.
                  </p>
                  <Button
                    onClick={onCreateQuiz}
                    className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Quiz
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map((quiz, index) => {
                  const Icon = getQuizIcon(index)
                  const gradient = getQuizGradient(index)

                  return (
                    <Card
                      key={quiz.id}
                      className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105 hover:shadow-2xl"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div
                            className={`p-3 bg-gradient-to-r ${gradient} rounded-xl shadow-lg group-hover:shadow-xl transition-all`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="bg-white/10 text-gray-300 border-white/20">
                              <Clock className="h-3 w-3 mr-1" />
                              {quiz.time_limit}m
                            </Badge>
                            <Badge variant="outline" className="border-white/20 text-gray-300">
                              <User className="h-3 w-3 mr-1" />
                              {quiz.created_by === user.id ? "You" : "Other"}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl text-white group-hover:text-purple-300 transition-colors">
                          {quiz.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400 line-clamp-2 min-h-[2.5rem]">
                          {quiz.description || "Test your knowledge with this exciting quiz challenge!"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button
                          onClick={() => onTakeQuiz(quiz)}
                          className={`w-full bg-gradient-to-r ${gradient} hover:shadow-lg text-white font-semibold py-3 rounded-xl transition-all group-hover:shadow-xl`}
                        >
                          <Trophy className="h-4 w-4 mr-2" />
                          Start Challenge
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent Activity Sidebar */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Award className="h-6 w-6 text-yellow-400" />
              Recent Activity
            </h2>

            {recentAttempts.length === 0 ? (
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardContent className="text-center py-12">
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full w-fit mx-auto mb-4">
                    <History className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No attempts yet</h3>
                  <p className="text-gray-400 text-sm mb-4">Start taking quizzes to see your progress here!</p>
                  <Button
                    variant="outline"
                    onClick={onViewAttempts}
                    className="border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200"
                  >
                    View All Attempts
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {recentAttempts.map((attempt, index) => {
                  const percentage = Math.round((attempt.score / attempt.total_questions) * 100)
                  const getScoreColor = (score: number) => {
                    if (score >= 90) return "text-yellow-400"
                    if (score >= 80) return "text-green-400"
                    if (score >= 70) return "text-blue-400"
                    if (score >= 60) return "text-orange-400"
                    return "text-red-400"
                  }

                  return (
                    <Card
                      key={attempt.id}
                      className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white text-sm truncate">{attempt.quizzes.title}</h4>
                          <Badge className={`${getScoreColor(percentage)} bg-white/10`}>{percentage}%</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>
                            {attempt.score}/{attempt.total_questions} correct
                          </span>
                          <span>{new Date(attempt.completed_at).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                <Button
                  variant="outline"
                  onClick={onViewAttempts}
                  className="w-full border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 font-semibold py-3 rounded-xl backdrop-blur-sm transition-all"
                >
                  <History className="h-4 w-4 mr-2" />
                  View All Progress
                </Button>
              </div>
            )}

            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/30 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Total Attempts</span>
                  <span className="text-white font-semibold">{recentAttempts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Best Score</span>
                  <span className="text-yellow-400 font-semibold">
                    {recentAttempts.length > 0
                      ? Math.max(...recentAttempts.map((a) => Math.round((a.score / a.total_questions) * 100)))
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Streak</span>
                  <span className="text-green-400 font-semibold">🔥 3 days</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
