"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Brain, Sparkles, Users, Trophy, Zap, BookOpen } from "lucide-react"

export function AuthForm() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "Success!",
        description: "Check your email for the confirmation link.",
      })
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })
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
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-20 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Brain
          className="absolute top-1/4 left-1/4 w-8 h-8 text-pink-400/30 animate-bounce"
          style={{ animationDelay: "0s" }}
        />
        <Trophy
          className="absolute top-1/3 right-1/4 w-6 h-6 text-yellow-400/30 animate-bounce"
          style={{ animationDelay: "1s" }}
        />
        <Sparkles
          className="absolute bottom-1/3 left-1/5 w-7 h-7 text-blue-400/30 animate-bounce"
          style={{ animationDelay: "2s" }}
        />
        <Zap
          className="absolute top-1/2 right-1/3 w-5 h-5 text-green-400/30 animate-bounce"
          style={{ animationDelay: "3s" }}
        />
        <BookOpen
          className="absolute bottom-1/4 right-1/5 w-6 h-6 text-purple-400/30 animate-bounce"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  QuizMaster
                </h1>
              </div>
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed">
                Challenge your mind, compete with friends, and master any topic with our interactive quiz platform
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-pink-400" />
                  </div>
                  <h3 className="font-semibold text-white">Social Learning</h3>
                </div>
                <p className="text-gray-300 text-sm">Create and share quizzes with your community</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Trophy className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white">Track Progress</h3>
                </div>
                <p className="text-gray-300 text-sm">Monitor your learning journey and achievements</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Zap className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-white">Timed Challenges</h3>
                </div>
                <p className="text-gray-300 text-sm">Test your knowledge under pressure</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white">Smart Feedback</h3>
                </div>
                <p className="text-gray-300 text-sm">Get detailed insights on your performance</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-400">Quizzes Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1M+</div>
                <div className="text-sm text-gray-400">Questions Answered</div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Get Started</CardTitle>
                <CardDescription className="text-gray-600">Join thousands of learners worldwide</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger
                      value="signin"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-violet-500 data-[state=active]:text-white"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-violet-500 data-[state=active]:text-white"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 border-2 border-gray-200 focus:border-violet-500 transition-colors"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-700 font-medium">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 border-2 border-gray-200 focus:border-violet-500 transition-colors"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                        disabled={loading}
                      >
                        {loading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-gray-700 font-medium">
                          Email
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 border-2 border-gray-200 focus:border-violet-500 transition-colors"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-gray-700 font-medium">
                          Password
                        </Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 border-2 border-gray-200 focus:border-violet-500 transition-colors"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                        disabled={loading}
                      >
                        {loading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
