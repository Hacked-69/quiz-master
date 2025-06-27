"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, ArrowLeft, Brain, Sparkles, Target, CheckCircle2, Clock, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Question {
  question_text: string
  options: string[]
  correct_answer: number
}

interface QuizCreatorProps {
  user: any
  onBack: () => void
}

export function QuizCreator({ user, onBack }: QuizCreatorProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timeLimit, setTimeLimit] = useState(10)
  const [questions, setQuestions] = useState<Question[]>([
    { question_text: "", options: ["", "", "", ""], correct_answer: 0 },
  ])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const addQuestion = () => {
    setQuestions([...questions, { question_text: "", options: ["", "", "", ""], correct_answer: 0 }])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions]
    updated[questionIndex].options[optionIndex] = value
    setQuestions(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate questions
      const validQuestions = questions.filter(
        (q) =>
          q.question_text.trim() &&
          q.options.every((opt) => opt.trim()) &&
          q.correct_answer >= 0 &&
          q.correct_answer < 4,
      )

      if (validQuestions.length === 0) {
        throw new Error("Please add at least one complete question")
      }

      // Create quiz
      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          title,
          description,
          time_limit: timeLimit,
          created_by: user.id,
        })
        .select()
        .single()

      if (quizError) throw quizError

      // Create questions
      const questionsToInsert = validQuestions.map((q) => ({
        quiz_id: quiz.id,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
      }))

      const { error: questionsError } = await supabase.from("questions").insert(questionsToInsert)

      if (questionsError) throw questionsError

      toast({
        title: "Success!",
        description: "Quiz created successfully",
      })

      onBack()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
              Create New Quiz
            </h1>
            <p className="text-gray-300 mt-1 text-lg">Design your quiz with questions and answers</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
          {/* Quiz Details Card */}
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-white">Quiz Details</CardTitle>
                  <CardDescription className="text-gray-300 text-lg">Basic information about your quiz</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-lg font-medium text-white">
                    Quiz Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter an engaging quiz title"
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 text-lg"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="timeLimit" className="text-lg font-medium text-white">
                    Time Limit (minutes)
                  </Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="1"
                    max="60"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number.parseInt(e.target.value))}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 text-lg"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="description" className="text-lg font-medium text-white">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what your quiz is about..."
                  rows={4}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 resize-none text-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Questions Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    Quiz Questions
                  </h2>
                  <p className="text-gray-300 text-sm">Create engaging questions for your quiz</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 text-sm font-semibold shadow-lg">
                {questions.length} Question{questions.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            {questions.map((question, questionIndex) => (
              <Card key={questionIndex} className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl shadow-lg">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-white">Question {questionIndex + 1}</CardTitle>
                    </div>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuestion(questionIndex)}
                        className="border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-lg font-medium text-white">Question Text</Label>
                    <Textarea
                      value={question.question_text}
                      onChange={(e) => updateQuestion(questionIndex, "question_text", e.target.value)}
                      placeholder="Enter your question here..."
                      rows={3}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 resize-none text-lg"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-lg font-medium text-white">Answer Options</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {question.options.map((option, optionIndex) => {
                        const isCorrect = question.correct_answer === optionIndex
                        const optionLetter = String.fromCharCode(65 + optionIndex)

                        return (
                          <div key={optionIndex} className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuestion(questionIndex, "correct_answer", optionIndex)}
                                className={`min-w-[100px] transition-all ${
                                  isCorrect
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg"
                                    : "border-white/20 bg-white/5 text-gray-300 hover:bg-white/10"
                                }`}
                              >
                                {isCorrect ? (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Correct
                                  </>
                                ) : (
                                  `Option ${optionLetter}`
                                )}
                              </Button>
                            </div>
                            <Input
                              value={option}
                              onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                              placeholder={`Enter option ${optionLetter}...`}
                              className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 text-lg"
                              required
                            />
                          </div>
                        )
                      })}
                    </div>
                    <p className="text-sm text-gray-400 bg-white/5 p-3 rounded-lg border border-white/10">
                      💡 Click on an option button to mark it as the correct answer
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={addQuestion}
              className="border-2 border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 font-semibold px-8 py-4 rounded-xl backdrop-blur-sm transition-all text-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Another Question
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                  Creating Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Create Quiz
                </>
              )}
            </Button>
          </div>

          {/* Progress Summary */}
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">
                      Complete Questions:{" "}
                      {questions.filter((q) => q.question_text.trim() && q.options.every((opt) => opt.trim())).length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Time Limit: {timeLimit} minutes</span>
                  </div>
                </div>
                <div className="text-gray-300 font-medium">
                  Progress: {questions.length} question{questions.length !== 1 ? "s" : ""} added
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
