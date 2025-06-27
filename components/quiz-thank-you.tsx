"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  CheckCircle,
  Star,
  Trophy,
  Target,
  Clock,
  MessageSquare,
  Sparkles,
  Home,
  Zap,
  Award,
  PartyPopper,
  Flame,
} from "lucide-react"
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

  const getPerformanceData = () => {
    if (percentage >= 90)
      return {
        message: "🏆 OUTSTANDING! You're a quiz master!",
        color: "from-yellow-400 to-orange-500",
        bgColor: "from-yellow-500/20 to-orange-500/20",
        icon: Trophy,
        celebration: "🎉🏆✨",
      }
    if (percentage >= 80)
      return {
        message: "🌟 EXCELLENT! Fantastic work!",
        color: "from-green-400 to-emerald-500",
        bgColor: "from-green-500/20 to-emerald-500/20",
        icon: Award,
        celebration: "🎊🌟💫",
      }
    if (percentage >= 70)
      return {
        message: "👏 GREAT JOB! Keep it up!",
        color: "from-blue-400 to-cyan-500",
        bgColor: "from-blue-500/20 to-cyan-500/20",
        icon: Target,
        celebration: "🎯👏🔥",
      }
    if (percentage >= 60)
      return {
        message: "💪 GOOD EFFORT! Room for improvement!",
        color: "from-orange-400 to-amber-500",
        bgColor: "from-orange-500/20 to-amber-500/20",
        icon: Zap,
        celebration: "💪⚡🚀",
      }
    return {
      message: "📚 KEEP PRACTICING! You'll get better!",
      color: "from-purple-400 to-violet-500",
      bgColor: "from-purple-500/20 to-violet-500/20",
      icon: Sparkles,
      celebration: "📚💜🌟",
    }
  }

  const performance = getPerformanceData()
  const PerformanceIcon = performance.icon

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Celebration Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <PartyPopper
          className="absolute top-1/4 left-1/4 w-8 h-8 text-yellow-400/40 animate-bounce"
          style={{ animationDelay: "0s" }}
        />
        <Sparkles
          className="absolute top-1/3 right-1/4 w-6 h-6 text-pink-400/40 animate-bounce"
          style={{ animationDelay: "1s" }}
        />
        <Trophy
          className="absolute bottom-1/3 left-1/5 w-7 h-7 text-yellow-400/40 animate-bounce"
          style={{ animationDelay: "2s" }}
        />
        <Star
          className="absolute top-1/2 right-1/3 w-5 h-5 text-blue-400/40 animate-bounce"
          style={{ animationDelay: "3s" }}
        />
        <Flame
          className="absolute bottom-1/4 right-1/5 w-6 h-6 text-orange-400/40 animate-bounce"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl space-y-8">
          {/* Main Results Card */}
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${performance.bgColor} opacity-50`} />
            <CardHeader className="text-center relative z-10 pb-6">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className={`p-6 bg-gradient-to-r ${performance.color} rounded-full shadow-2xl`}>
                    <PerformanceIcon className="h-16 w-16 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                    {performance.celebration.split("")[0]}
                  </div>
                  <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce delay-500">
                    {performance.celebration.split("")[1]}
                  </div>
                  <div className="absolute -top-2 -left-2 text-2xl animate-bounce delay-1000">
                    {performance.celebration.split("")[2]}
                  </div>
                </div>
              </div>
              <CardTitle className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
                Quiz Completed!
              </CardTitle>
              <CardDescription className="text-xl text-gray-300 font-medium">{quiz.title}</CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 space-y-8 pb-8">
              {/* Score Display */}
              <div className="text-center space-y-6">
                <div
                  className={`inline-flex items-center gap-4 bg-gradient-to-r ${performance.color} p-6 rounded-3xl shadow-2xl`}
                >
                  <Trophy className="h-10 w-10 text-white" />
                  <div className="text-white">
                    <div className="text-5xl lg:text-6xl font-bold">
                      {score}/{totalQuestions}
                    </div>
                    <div className="text-lg opacity-90">Questions Correct</div>
                  </div>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-gray-300 font-medium">Your Score</span>
                    <span className="font-bold text-white text-2xl">{percentage}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={percentage} className="h-4 bg-white/10 rounded-full overflow-hidden" />
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${performance.color} rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div
                  className={`text-2xl font-bold bg-gradient-to-r ${performance.color} bg-clip-text text-transparent`}
                >
                  {performance.message}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
                  <Target className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{percentage}%</div>
                  <div className="text-gray-300">Accuracy</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
                  <Clock className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{quiz.time_limit}</div>
                  <div className="text-gray-300">Minutes Allowed</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
                  <CheckCircle className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{score}</div>
                  <div className="text-gray-300">Correct Answers</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Card */}
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-white">
                <div className="p-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                Share Your Experience
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Help us improve by sharing your thoughts about this quiz
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!feedbackSubmitted ? (
                <form onSubmit={handleSubmitFeedback} className="space-y-8">
                  {/* Star Rating */}
                  <div className="space-y-4">
                    <Label className="text-lg font-medium text-white">Rate this quiz</Label>
                    <div className="flex gap-2 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleStarClick(star)}
                          className="transition-all duration-200 hover:scale-125 p-2"
                        >
                          <Star
                            className={`h-10 w-10 ${
                              star <= rating
                                ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
                                : "text-gray-500 hover:text-yellow-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <p className="text-center text-gray-300 font-medium">
                        {rating === 1 && "😞 Poor - Needs improvement"}
                        {rating === 2 && "😐 Fair - Could be better"}
                        {rating === 3 && "🙂 Good - Satisfactory"}
                        {rating === 4 && "😊 Very Good - Well done"}
                        {rating === 5 && "🤩 Excellent - Outstanding!"}
                      </p>
                    )}
                  </div>

                  {/* Feedback Text */}
                  <div className="space-y-3">
                    <Label htmlFor="feedback" className="text-lg font-medium text-white">
                      Additional Comments (Optional)
                    </Label>
                    <Textarea
                      id="feedback"
                      placeholder="What did you think about this quiz? Any suggestions for improvement?"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      rows={4}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 resize-none text-lg"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={submittingFeedback || rating === 0}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onBackToDashboard}
                      className="border-2 border-gray-500/50 bg-gray-500/10 hover:bg-gray-500/20 text-gray-300 hover:text-gray-200 font-semibold py-4 px-8 rounded-xl backdrop-blur-sm transition-all"
                    >
                      <Home className="h-5 w-5 mr-2" />
                      Skip
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center space-y-6 py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-2xl">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">Thank you for your feedback!</h3>
                    <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
                      Your input helps us create better quizzes for everyone. 🙏
                    </p>
                    <Button
                      onClick={onBackToDashboard}
                      className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                    >
                      <Home className="h-5 w-5 mr-2" />
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
