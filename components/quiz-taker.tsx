"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock } from "lucide-react"
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading quiz...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Badge variant="secondary" className="flex items-center gap-2 text-lg px-4 py-2">
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </Badge>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold">{quiz.title}</h1>
              <span className="text-gray-600">
                {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{currentQ?.question_text}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQ?.options.map((option, index) => (
                <Button
                  key={index}
                  variant={answers[currentQuestion] === index ? "default" : "outline"}
                  className="w-full text-left justify-start h-auto p-4"
                  onClick={() => handleAnswerSelect(index)}
                >
                  <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              Previous
            </Button>
            <Button onClick={handleNext} disabled={answers[currentQuestion] === -1}>
              {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
