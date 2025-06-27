-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    time_limit INTEGER NOT NULL DEFAULT 10,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for quizzes (anyone can read, only authenticated users can create)
CREATE POLICY "Anyone can view quizzes" ON public.quizzes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create quizzes" ON public.quizzes
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own quizzes" ON public.quizzes
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own quizzes" ON public.quizzes
    FOR DELETE USING (auth.uid() = created_by);

-- Create policies for questions (anyone can read, only quiz creators can modify)
CREATE POLICY "Anyone can view questions" ON public.questions
    FOR SELECT USING (true);

CREATE POLICY "Quiz creators can insert questions" ON public.questions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.quizzes 
            WHERE id = quiz_id AND created_by = auth.uid()
        )
    );

CREATE POLICY "Quiz creators can update questions" ON public.questions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.quizzes 
            WHERE id = quiz_id AND created_by = auth.uid()
        )
    );

CREATE POLICY "Quiz creators can delete questions" ON public.questions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.quizzes 
            WHERE id = quiz_id AND created_by = auth.uid()
        )
    );

-- Create policies for quiz_attempts (users can only see their own attempts)
CREATE POLICY "Users can view their own attempts" ON public.quiz_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attempts" ON public.quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);
