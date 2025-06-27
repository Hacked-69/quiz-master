"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, Brain, Zap, Target, CheckCircle2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { QuizThankYou } from "./quiz-thank-you"

interface Question {
  id: string
  question_text: string
  options: string[]
  correct_answer: number
}

interface Quiz {
  id: string
  title: string
  description: string | null
  time_limit: number
}

interface QuizTakerProps {
  quiz: Quiz
  user: any
  onBack: () => void
}

export function QuizTaker({ quiz, user, onBack }: QuizTakerProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(quiz.time_limit * 60) // Convert to seconds
  const [loading, setLoading] = useState(true)
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)
  const { toast } = useToast()
  const [attemptId, setAttemptId] = useState<string>("")

  useEffect(() => {
    fetchQuestions()
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && !finished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !finished) {
      handleFinishQuiz()
    }
  }, [timeLeft, finished])

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase.from("questions").select("*").eq("quiz_id", quiz.id).order("created_at")

      if (error) throw error
      setQuestions(data || [])
      setAnswers(new Array(data?.length || 0).fill(-1))
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch questions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleFinishQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleFinishQuiz = async () => {
    setFinished(true)

    // Calculate score
    let correctAnswers = 0
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correctAnswers++
      }
    })

    setScore(correctAnswers)

    // Save attempt to database
    try {
      const { data, error } = await supabase
        .from("quiz_attempts")
        .insert({
          quiz_id: quiz.id,
          user_id: user.id,
          score: correctAnswers,
          total_questions: questions.length,
        })
        .select()
        .single()

      if (error) throw error
      if (data) setAttemptId(data.id)
    } catch (error: any) {
      console.error("Failed to save quiz attempt:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTimeColor = () => {
    if (timeLeft <= 60) return "from-red-500 to-pink-500" // Last minute
    if (timeLeft <= 300) return "from-orange-500 to-yellow-500" // Last 5 minutes
    return "from-green-500 to-emerald-500" // Normal time
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500 mx-auto"></div>
            <Brain className="absolute inset-0 m-auto h-6 w-6 text-purple-400 animate-pulse" />
          </div>
          <p className="mt-4 text-gray-300 text-lg">Loading quiz questions...</p>
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <QuizThankYou
        quiz={quiz}
        user={user}
        score={score}
        totalQuestions={questions.length}
        attemptId={attemptId}
        onBackToDashboard={onBack}
      />
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

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
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-2 border-gray-500/50 bg-gray-500/10 hover:bg-gray-500/20 text-gray-300 hover:text-gray-200 font-semibold px-6 py-3 rounded-xl backdrop-blur-sm transition-all"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
          <Badge
            className={`bg-gradient-to-r ${getTimeColor()} text-white text-lg px-6 py-3 shadow-lg ${
              timeLeft <= 60 ? "animate-pulse" : ""
            }`}
          >
            <Clock className="h-5 w-5 mr-2" />
            {formatTime(timeLeft)}
            {timeLeft <= 60 && <AlertCircle className="h-4 w-4 ml-2" />}
          </Badge>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Quiz Header */}
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl lg:text-3xl font-bold text-white">{quiz.title}</CardTitle>
                  <p className="text-gray-300 mt-1">
                    Question {currentQuestion + 1} of {questions.length}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                    {Math.round(progress)}%
                  </div>
                  <div className="text-sm text-gray-400">Complete</div>
                </div>
              </div>
              <div className="relative">
                <Progress value={progress} className="h-3 bg-white/10 rounded-full overflow-hidden" />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardHeader>
          </Card>

          {/* Question Card */}
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl">
            <CardHeader className="pb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg flex-shrink-0">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl lg:text-2xl text-white leading-relaxed">
                  {currentQ?.question_text}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQ?.options.map((option, index) => {
                const isSelected = answers[currentQuestion] === index
                const optionLetter = String.fromCharCode(65 + index)

                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full text-left justify-start h-auto p-6 rounded-xl transition-all duration-300 border-2 ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50 text-white shadow-lg scale-105"
                        : "bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30 hover:text-white hover:scale-102"
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                          isSelected
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : "bg-white/10 text-gray-400"
                        }`}
                      >
                        {isSelected ? <CheckCircle2 className="h-5 w-5" /> : optionLetter}
                      </div>
                      <span className="text-lg font-medium flex-1">{option}</span>
                    </div>
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="border-2 border-gray-500/50 bg-gray-500/10 hover:bg-gray-500/20 text-gray-300 hover:text-gray-200 font-semibold px-8 py-4 rounded-xl backdrop-blur-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentQuestion
                      ? "bg-gradient-to-r from-pink-500 to-violet-500 scale-125"
                      : answers[index] !== -1
                        ? "bg-green-500"
                        : "bg-white/20"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={answers[currentQuestion] === -1}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === questions.length - 1 ? (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Finish Quiz
                </>
              ) : (
                <>
                  Next Question
                  <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
                </>
              )}
            </Button>
          </div>

          {/* Question Overview */}
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">Answered: {answers.filter((answer) => answer !== -1).length}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Remaining: {answers.filter((answer) => answer === -1).length}</span>
                  </div>
                </div>
                <div className="text-gray-300 font-medium">Progress: {Math.round(progress)}% Complete</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
