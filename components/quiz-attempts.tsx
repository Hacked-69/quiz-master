"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Trophy,
  Target,
  Star,
  MessageSquare,
  TrendingUp,
  Award,
  Brain,
  Sparkles,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuizAttempt {
  id: string
  quiz_id: string
  score: number
  total_questions: number
  completed_at: string
  quiz: {
    title: string
    description: string | null
    time_limit: number
  }
  feedback?: {
    rating: number | null
    feedback_text: string | null
  }
}

interface QuizAttemptsProps {
  user: any
  onBack: () => void
}

export function QuizAttempts({ user, onBack }: QuizAttemptsProps) {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchAttempts()
  }, [])

  const fetchAttempts = async () => {
    try {
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select(`
          *,
          quizzes!inner(title, description, time_limit),
          quiz_feedback(rating, feedback_text)
        `)
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })

      if (error) throw error

      const formattedAttempts =
        data?.map((attempt) => ({
          id: attempt.id,
          quiz_id: attempt.quiz_id,
          score: attempt.score,
          total_questions: attempt.total_questions,
          completed_at: attempt.completed_at,
          quiz: {
            title: attempt.quizzes.title,
            description: attempt.quizzes.description,
            time_limit: attempt.quizzes.time_limit,
          },
          feedback: attempt.quiz_feedback?.[0] || null,
        })) || []

      setAttempts(formattedAttempts)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch quiz attempts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return "from-yellow-500 to-orange-500"
    if (percentage >= 80) return "from-green-500 to-emerald-500"
    if (percentage >= 70) return "from-blue-500 to-cyan-500"
    if (percentage >= 60) return "from-orange-500 to-amber-500"
    return "from-purple-500 to-violet-500"
  }

  const getPerformanceBg = (percentage: number) => {
    if (percentage >= 90) return "from-yellow-500/20 to-orange-500/20"
    if (percentage >= 80) return "from-green-500/20 to-emerald-500/20"
    if (percentage >= 70) return "from-blue-500/20 to-cyan-500/20"
    if (percentage >= 60) return "from-orange-500/20 to-amber-500/20"
    return "from-purple-500/20 to-violet-500/20"
  }

  const getPerformanceLabel = (percentage: number) => {
    if (percentage >= 90) return "Outstanding"
    if (percentage >= 80) return "Excellent"
    if (percentage >= 70) return "Good"
    if (percentage >= 60) return "Fair"
    return "Needs Improvement"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateStats = () => {
    if (attempts.length === 0) return null

    const totalAttempts = attempts.length
    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0)
    const totalQuestions = attempts.reduce((sum, attempt) => sum + attempt.total_questions, 0)
    const averagePercentage = Math.round((totalScore / totalQuestions) * 100)
    const bestScore = Math.max(
      ...attempts.map((attempt) => Math.round((attempt.score / attempt.total_questions) * 100)),
    )
    const recentAttempts = attempts.slice(0, 5)
    const recentAverage =
      recentAttempts.length > 0
        ? Math.round(
            (recentAttempts.reduce((sum, attempt) => sum + attempt.score, 0) /
              recentAttempts.reduce((sum, attempt) => sum + attempt.total_questions, 0)) *
              100,
          )
        : 0

    return {
      totalAttempts,
      averagePercentage,
      bestScore,
      recentAverage,
    }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500 mx-auto"></div>
            <Brain className="absolute inset-0 m-auto h-6 w-6 text-purple-400 animate-pulse" />
          </div>
          <p className="mt-4 text-gray-300 text-lg">Loading your attempts...</p>
        </div>
      </div>
    )
  }

  if (selectedAttempt) {
    const percentage = Math.round((selectedAttempt.score / selectedAttempt.total_questions) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => setSelectedAttempt(null)}
              className="border-2 border-gray-500/50 bg-gray-500/10 hover:bg-gray-500/20 text-gray-300 hover:text-gray-200 font-semibold px-6 py-3 rounded-xl backdrop-blur-sm transition-all"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Attempts
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Attempt Details</h1>
              <p className="text-gray-300 mt-1">{selectedAttempt.quiz.title}</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Detailed Results Card */}
            <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${getPerformanceBg(percentage)} opacity-50`} />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 text-white text-2xl">
                  <div className={`p-3 bg-gradient-to-r ${getPerformanceColor(percentage)} rounded-xl shadow-lg`}>
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  Quiz Results
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  {formatDate(selectedAttempt.completed_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      {selectedAttempt.score}/{selectedAttempt.total_questions}
                    </div>
                    <div className="text-gray-300">Questions Correct</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-4xl font-bold bg-gradient-to-r ${getPerformanceColor(percentage)} bg-clip-text text-transparent mb-2`}
                    >
                      {percentage}%
                    </div>
                    <div className="text-gray-300">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <Badge
                      className={`text-lg px-4 py-2 bg-gradient-to-r ${getPerformanceColor(percentage)} text-white border-0`}
                    >
                      {getPerformanceLabel(percentage)}
                    </Badge>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <Progress value={percentage} className="h-4 bg-white/10 rounded-full overflow-hidden" />
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${getPerformanceColor(percentage)} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quiz Information */}
            <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-xl">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  Quiz Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-white">Time Limit</div>
                      <div className="text-gray-300">{selectedAttempt.quiz.time_limit} minutes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-white">Completed</div>
                      <div className="text-gray-300">{formatDate(selectedAttempt.completed_at)}</div>
                    </div>
                  </div>
                </div>
                {selectedAttempt.quiz.description && (
                  <div>
                    <div className="font-medium mb-2 text-white">Description</div>
                    <p className="text-gray-300">{selectedAttempt.quiz.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feedback Section */}
            {selectedAttempt.feedback && (
              <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white text-xl">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    Your Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedAttempt.feedback.rating && (
                    <div>
                      <div className="font-medium mb-2 text-white">Rating</div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= selectedAttempt.feedback!.rating!
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-500"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedAttempt.feedback.feedback_text && (
                    <div>
                      <div className="font-medium mb-2 text-white">Comments</div>
                      <p className="text-gray-300 bg-white/5 p-3 rounded-lg border border-white/10">
                        {selectedAttempt.feedback.feedback_text}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
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
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-2 border-gray-500/50 bg-gray-500/10 hover:bg-gray-500/20 text-gray-300 hover:text-gray-200 font-semibold px-6 py-3 rounded-xl backdrop-blur-sm transition-all"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              My Quiz Journey
            </h1>
            <p className="text-gray-300 mt-1 text-lg">Track your progress and celebrate achievements</p>
          </div>
        </div>

        {/* Statistics Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-pink-500/30 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-200 text-sm font-medium">Total Attempts</p>
                    <p className="text-3xl font-bold text-white">{stats.totalAttempts}</p>
                  </div>
                  <div className="p-3 bg-pink-500/30 rounded-xl">
                    <Trophy className="h-6 w-6 text-pink-200" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-sm font-medium">Average Score</p>
                    <p className="text-3xl font-bold text-white">{stats.averagePercentage}%</p>
                  </div>
                  <div className="p-3 bg-green-500/30 rounded-xl">
                    <Target className="h-6 w-6 text-green-200" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-200 text-sm font-medium">Best Score</p>
                    <p className="text-3xl font-bold text-white">{stats.bestScore}%</p>
                  </div>
                  <div className="p-3 bg-yellow-500/30 rounded-xl">
                    <Award className="h-6 w-6 text-yellow-200" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/30 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">Recent Average</p>
                    <p className="text-3xl font-bold text-white">{stats.recentAverage}%</p>
                  </div>
                  <div className="p-3 bg-purple-500/30 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-purple-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attempts List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              Your Attempts
            </h2>
            <Badge className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-3 py-1">
              {attempts.length} Total
            </Badge>
          </div>

          {attempts.length === 0 ? (
            <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl">
              <CardContent className="text-center py-16">
                <div className="p-4 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full w-fit mx-auto mb-6">
                  <Trophy className="h-16 w-16 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No attempts yet</h3>
                <p className="text-gray-300 mb-6 max-w-md mx-auto">Start taking quizzes to see your progress here!</p>
                <Button
                  onClick={onBack}
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Browse Quizzes
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {attempts.map((attempt) => {
                const percentage = Math.round((attempt.score / attempt.total_questions) * 100)

                return (
                  <Card
                    key={attempt.id}
                    className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-102 hover:shadow-2xl"
                    onClick={() => setSelectedAttempt(attempt)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-semibold text-white">{attempt.quiz.title}</h3>
                            <Badge
                              className={`bg-gradient-to-r ${getPerformanceColor(percentage)} text-white border-0`}
                            >
                              {getPerformanceLabel(percentage)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-gray-300">
                            <div className="flex items-center gap-2">
                              <Trophy className="h-4 w-4" />
                              <span className="font-medium">
                                {attempt.score}/{attempt.total_questions} ({percentage}%)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{attempt.quiz.time_limit} min</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(attempt.completed_at)}</span>
                            </div>
                            {attempt.feedback?.rating && (
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <span>{attempt.feedback.rating}/5</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-3xl font-bold bg-gradient-to-r ${getPerformanceColor(percentage)} bg-clip-text text-transparent mb-2`}
                          >
                            {percentage}%
                          </div>
                          <div className="relative w-24">
                            <Progress value={percentage} className="h-3 bg-white/10 rounded-full overflow-hidden" />
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${getPerformanceColor(percentage)} rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
