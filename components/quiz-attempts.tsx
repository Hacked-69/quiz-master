"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, Clock, Trophy, Target, Star, MessageSquare, TrendingUp, Award } from "lucide-react"
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
    if (percentage >= 90) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200"
    if (percentage >= 70) return "text-blue-600 bg-blue-50 border-blue-200"
    if (percentage >= 60) return "text-orange-600 bg-orange-50 border-orange-200"
    return "text-purple-600 bg-purple-50 border-purple-200"
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your attempts...</p>
        </div>
      </div>
    )
  }

  if (selectedAttempt) {
    const percentage = Math.round((selectedAttempt.score / selectedAttempt.total_questions) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => setSelectedAttempt(null)}
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Attempts
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Attempt Details</h1>
              <p className="text-gray-600 mt-1">{selectedAttempt.quiz.title}</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Detailed Results Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <CardTitle className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  Quiz Results
                </CardTitle>
                <CardDescription>{formatDate(selectedAttempt.completed_at)}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {selectedAttempt.score}/{selectedAttempt.total_questions}
                    </div>
                    <div className="text-sm text-gray-600">Questions Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">{percentage}%</div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <Badge className={`text-lg px-4 py-2 ${getPerformanceColor(percentage)}`}>
                      {getPerformanceLabel(percentage)}
                    </Badge>
                  </div>
                </div>

                <div className="mt-6">
                  <Progress value={percentage} className="h-4" />
                </div>
              </CardContent>
            </Card>

            {/* Quiz Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Quiz Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium">Time Limit</div>
                      <div className="text-sm text-gray-600">{selectedAttempt.quiz.time_limit} minutes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium">Completed</div>
                      <div className="text-sm text-gray-600">{formatDate(selectedAttempt.completed_at)}</div>
                    </div>
                  </div>
                </div>
                {selectedAttempt.quiz.description && (
                  <div>
                    <div className="font-medium mb-2">Description</div>
                    <p className="text-gray-600">{selectedAttempt.quiz.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feedback Section */}
            {selectedAttempt.feedback && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-purple-500" />
                    Your Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedAttempt.feedback.rating && (
                    <div>
                      <div className="font-medium mb-2">Rating</div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= selectedAttempt.feedback!.rating!
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedAttempt.feedback.feedback_text && (
                    <div>
                      <div className="font-medium mb-2">Comments</div>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Quiz Attempts</h1>
            <p className="text-gray-600 mt-1">Track your progress and review past performances</p>
          </div>
        </div>

        {/* Statistics Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.totalAttempts}</div>
                <div className="text-sm text-gray-600">Total Attempts</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.averagePercentage}%</div>
                <div className="text-sm text-gray-600">Average Score</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.bestScore}%</div>
                <div className="text-sm text-gray-600">Best Score</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.recentAverage}%</div>
                <div className="text-sm text-gray-600">Recent Average</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attempts List */}
        <div className="space-y-4">
          {attempts.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No attempts yet</h3>
                <p className="text-gray-600 mb-4">Start taking quizzes to see your progress here!</p>
                <Button onClick={onBack}>Browse Quizzes</Button>
              </CardContent>
            </Card>
          ) : (
            attempts.map((attempt) => {
              const percentage = Math.round((attempt.score / attempt.total_questions) * 100)

              return (
                <Card
                  key={attempt.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedAttempt(attempt)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{attempt.quiz.title}</h3>
                          <Badge className={`${getPerformanceColor(percentage)}`}>
                            {getPerformanceLabel(percentage)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4" />
                            {attempt.score}/{attempt.total_questions} ({percentage}%)
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {attempt.quiz.time_limit} min
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(attempt.completed_at)}
                          </div>
                          {attempt.feedback?.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              {attempt.feedback.rating}/5
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{percentage}%</div>
                        <Progress value={percentage} className="w-24 h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
