-- Create feedback table
CREATE TABLE IF NOT EXISTS public.quiz_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    attempt_id UUID REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.quiz_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for feedback
CREATE POLICY "Users can view feedback for quizzes they created" ON public.quiz_feedback
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quizzes 
            WHERE id = quiz_id AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can create their own feedback" ON public.quiz_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback" ON public.quiz_feedback
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback" ON public.quiz_feedback
    FOR DELETE USING (auth.uid() = user_id);
