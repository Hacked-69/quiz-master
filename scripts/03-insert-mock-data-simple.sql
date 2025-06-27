-- Simple version: Insert mock data that will work with any authenticated user
-- This creates quizzes without a specific owner, so anyone can see them

-- Temporarily disable RLS to insert sample data
ALTER TABLE public.quizzes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;

-- Insert sample quizzes (using a placeholder UUID that won't conflict)
INSERT INTO public.quizzes (title, description, time_limit, created_by) VALUES
    ('General Knowledge Quiz', 'Test your general knowledge with this fun quiz!', 15, '00000000-0000-0000-0000-000000000000'),
    ('Science & Technology', 'Questions about science, technology, and innovation', 20, '00000000-0000-0000-0000-000000000000'),
    ('History Quiz', 'Test your knowledge of world history', 25, '00000000-0000-0000-0000-000000000000'),
    ('Quick Math Challenge', 'Fast-paced math questions for sharp minds', 10, '00000000-0000-0000-0000-000000000000');

-- Get the quiz IDs for inserting questions
DO $$
DECLARE
    quiz_rec RECORD;
BEGIN
    -- Insert questions for each quiz
    FOR quiz_rec IN SELECT id, title FROM public.quizzes WHERE created_by = '00000000-0000-0000-0000-000000000000'
    LOOP
        IF quiz_rec.title = 'General Knowledge Quiz' THEN
            INSERT INTO public.questions (quiz_id, question_text, options, correct_answer) VALUES
                (quiz_rec.id, 'What is the capital of France?', ARRAY['London', 'Berlin', 'Paris', 'Madrid'], 2),
                (quiz_rec.id, 'Which planet is known as the Red Planet?', ARRAY['Venus', 'Mars', 'Jupiter', 'Saturn'], 1),
                (quiz_rec.id, 'Who painted the Mona Lisa?', ARRAY['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'], 2),
                (quiz_rec.id, 'What is the largest ocean on Earth?', ARRAY['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'], 3),
                (quiz_rec.id, 'In which year did World War II end?', ARRAY['1944', '1945', '1946', '1947'], 1);
        
        ELSIF quiz_rec.title = 'Science & Technology' THEN
            INSERT INTO public.questions (quiz_id, question_text, options, correct_answer) VALUES
                (quiz_rec.id, 'What does CPU stand for?', ARRAY['Central Processing Unit', 'Computer Personal Unit', 'Central Program Unit', 'Computer Processing Unit'], 0),
                (quiz_rec.id, 'Which element has the chemical symbol "O"?', ARRAY['Gold', 'Silver', 'Oxygen', 'Iron'], 2),
                (quiz_rec.id, 'What is the speed of light in vacuum?', ARRAY['300,000 km/s', '299,792,458 m/s', '186,000 miles/s', 'All of the above'], 3),
                (quiz_rec.id, 'Who developed the theory of relativity?', ARRAY['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Stephen Hawking'], 1),
                (quiz_rec.id, 'What does HTML stand for?', ARRAY['Hypertext Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'], 0);
        
        ELSIF quiz_rec.title = 'History Quiz' THEN
            INSERT INTO public.questions (quiz_id, question_text, options, correct_answer) VALUES
                (quiz_rec.id, 'Who was the first President of the United States?', ARRAY['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'], 2),
                (quiz_rec.id, 'In which year did the Berlin Wall fall?', ARRAY['1987', '1988', '1989', '1990'], 2),
                (quiz_rec.id, 'Which ancient wonder of the world was located in Alexandria?', ARRAY['Hanging Gardens', 'Lighthouse of Alexandria', 'Colossus of Rhodes', 'Temple of Artemis'], 1),
                (quiz_rec.id, 'Who was known as the "Iron Lady"?', ARRAY['Queen Elizabeth II', 'Margaret Thatcher', 'Indira Gandhi', 'Golda Meir'], 1),
                (quiz_rec.id, 'The Renaissance period began in which country?', ARRAY['France', 'Germany', 'Italy', 'Spain'], 2);
        
        ELSIF quiz_rec.title = 'Quick Math Challenge' THEN
            INSERT INTO public.questions (quiz_id, question_text, options, correct_answer) VALUES
                (quiz_rec.id, 'What is 15 × 8?', ARRAY['110', '120', '125', '130'], 1),
                (quiz_rec.id, 'What is the square root of 144?', ARRAY['11', '12', '13', '14'], 1),
                (quiz_rec.id, 'If a triangle has angles of 60°, 60°, and 60°, what type of triangle is it?', ARRAY['Right triangle', 'Isosceles triangle', 'Equilateral triangle', 'Scalene triangle'], 2),
                (quiz_rec.id, 'What is 25% of 200?', ARRAY['25', '50', '75', '100'], 1),
                (quiz_rec.id, 'What is the value of π (pi) rounded to 2 decimal places?', ARRAY['3.14', '3.15', '3.16', '3.17'], 0);
        END IF;
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
