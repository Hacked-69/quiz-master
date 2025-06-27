"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Star, Trophy, Target, Clock, MessageSquare, Sparkles, Home } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuizThankYouProps {
  quiz: {
    id: string
    title: string
    description: string | null
    time_limit: number
  }
  user: any
  score: number
  totalQuestions: number
  attemptId: string
  onBackToDashboard: () => void
}

export function QuizThankYou({ quiz, user, score, totalQuestions, attemptId, onBackToDashboard }: QuizThankYouProps) {
  const [rating, setRating] = useState<number>(0)
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const { toast } = useToast()

  const percentage = Math.round((score / totalQuestions) * 100)

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Outstanding! You're a quiz master! 🏆", color: "text-yellow-600" }
    if (percentage >= 80) return { message: "Excellent work! Well done! 🌟", color: "text-green-600" }
    if (percentage >= 70) return { message: "Great job! Keep it up! 👏", color: "text-blue-600" }
    if (percentage >= 60) return { message: "Good effort! Room for improvement! 💪", color: "text-orange-600" }
    return { message: "Keep practicing! You'll get better! 📚", color: "text-purple-600" }
  }

  const performance = getPerformanceMessage()

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      })
      return
    }

    setSubmittingFeedback(true)

    try {
      const { error } = await supabase.from("quiz_feedback").insert({
        quiz_id: quiz.id,
        user_id: user.id,
        attempt_id: attemptId,
        rating,
        feedback_text: feedbackText.trim() || null,
      })

      if (error) throw error

      setFeedbackSubmitted(true)
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingFeedback(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Results Card */}
        <Card className="relative overflow-hidden border-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
          <CardHeader className="text-center relative z-10 pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <CheckCircle className="h-20 w-20 text-green-500 drop-shadow-lg" />
                <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quiz Completed!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-2">{quiz.title}</CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            {/* Score Display */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {score}/{totalQuestions}
                  </div>
                  <div className="text-sm text-gray-600">Questions Correct</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Your Score</span>
                  <span className="font-semibold">{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-3 bg-gray-200" />
              </div>

              <div className={`text-lg font-semibold ${performance.color}`}>{performance.message}</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center">
                <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center">
                <Clock className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{quiz.time_limit}</div>
                <div className="text-sm text-gray-600">Minutes Allowed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Share Your Experience
            </CardTitle>
            <CardDescription>Help us improve by sharing your thoughts about this quiz</CardDescription>
          </CardHeader>

          <CardContent>
            {!feedbackSubmitted ? (
              <form onSubmit={handleSubmitFeedback} className="space-y-6">
                {/* Star Rating */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Rate this quiz</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className="transition-all duration-200 hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 hover:text-yellow-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-gray-600">
                      {rating === 1 && "Poor - Needs improvement"}
                      {rating === 2 && "Fair - Could be better"}
                      {rating === 3 && "Good - Satisfactory"}
                      {rating === 4 && "Very Good - Well done"}
                      {rating === 5 && "Excellent - Outstanding!"}
                    </p>
                  )}
                </div>

                {/* Feedback Text */}
                <div className="space-y-2">
                  <Label htmlFor="feedback" className="text-sm font-medium">
                    Additional Comments (Optional)
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="What did you think about this quiz? Any suggestions for improvement?"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={submittingFeedback || rating === 0} className="flex-1">
                    {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBackToDashboard}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Home className="h-4 w-4" />
                    Skip
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4 py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank you for your feedback!</h3>
                  <p className="text-gray-600 mb-6">Your input helps us create better quizzes for everyone.</p>
                  <Button onClick={onBackToDashboard} className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
