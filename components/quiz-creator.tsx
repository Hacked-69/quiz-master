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
import { Plus, Trash2, ArrowLeft } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
            <p className="text-gray-600 mt-1">Design your quiz with questions and answers</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
              <CardDescription>Basic information about your quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your quiz"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min="1"
                  max="60"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number.parseInt(e.target.value))}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {questions.map((question, questionIndex) => (
            <Card key={questionIndex}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Question {questionIndex + 1}</CardTitle>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Question Text</Label>
                  <Textarea
                    value={question.question_text}
                    onChange={(e) => updateQuestion(questionIndex, "question_text", e.target.value)}
                    placeholder="Enter your question"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label>Answer Options</Label>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-3">
                      <Badge
                        variant={question.correct_answer === optionIndex ? "default" : "outline"}
                        className="min-w-[60px] justify-center cursor-pointer"
                        onClick={() => updateQuestion(questionIndex, "correct_answer", optionIndex)}
                      >
                        {question.correct_answer === optionIndex ? "Correct" : `Option ${optionIndex + 1}`}
                      </Badge>
                      <Input
                        value={option}
                        onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                        required
                      />
                    </div>
                  ))}
                  <p className="text-sm text-gray-600">Click on a badge to mark it as the correct answer</p>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={addQuestion}
              className="flex items-center gap-2 bg-transparent"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
            <Button type="submit" disabled={loading} className="flex items-center gap-2">
              {loading ? "Creating..." : "Create Quiz"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
