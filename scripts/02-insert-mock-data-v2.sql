-- Insert sample quizzes with a placeholder user ID
-- Note: Replace 'your-user-id-here' with an actual user ID after creating a user account
-- Or run this after you've signed up in the app

-- For demo purposes, we'll use a sample UUID that you can replace
-- You can get your actual user ID from the Supabase dashboard after signing up

DO $$
DECLARE
    sample_user_id UUID := '00000000-0000-0000-0000-000000000000';
    quiz1_id UUID := '550e8400-e29b-41d4-a716-446655440001';
    quiz2_id UUID := '550e8400-e29b-41d4-a716-446655440002';
    quiz3_id UUID := '550e8400-e29b-41d4-a716-446655440003';
    quiz4_id UUID := '550e8400-e29b-41d4-a716-446655440004';
BEGIN
    -- Insert sample quizzes
    INSERT INTO public.quizzes (id, title, description, time_limit, created_by) VALUES
        (quiz1_id, 'General Knowledge Quiz', 'Test your general knowledge with this fun quiz!', 15, sample_user_id),
        (quiz2_id, 'Science & Technology', 'Questions about science, technology, and innovation', 20, sample_user_id),
        (quiz3_id, 'History Quiz', 'Test your knowledge of world history', 25, sample_user_id),
        (quiz4_id, 'Quick Math Challenge', 'Fast-paced math questions for sharp minds', 10, sample_user_id)
    ON CONFLICT (id) DO NOTHING;

    -- Insert sample questions for General Knowledge Quiz
    INSERT INTO public.questions (quiz_id, question_text, options, correct_answer) VALUES
        (quiz1_id, 'What is the capital of France?', ARRAY['London', 'Berlin', 'Paris', 'Madrid'], 2),
        (quiz1_id, 'Which planet is known as the Red Planet?', ARRAY['Venus', 'Mars', 'Jupiter', 'Saturn'], 1),
        (quiz1_id, 'Who painted the Mona Lisa?', ARRAY['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'], 2),
        (quiz1_id, 'What is the largest ocean on Earth?', ARRAY['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'], 3),
        (quiz1_id, 'In which year did World War II end?', ARRAY['1944', '1945', '1946', '1947'], 1)
    ON CONFLICT DO NOTHING;

    -- Insert sample questions for Science & Technology Quiz
    INSERT INTO public.questions (quiz_id, question_text, options, correct_answer) VALUES
        (quiz2_id, 'What does CPU stand for?', ARRAY['Central Processing Unit', 'Computer Personal Unit', 'Central Program Unit', 'Computer Processing Unit'], 0),
        (quiz2_id, 'Which element has the chemical symbol "O"?', ARRAY['Gold', 'Silver', 'Oxygen', 'Iron'], 2),
        (quiz2_id, 'What is the speed of light in vacuum?', ARRAY['300,000 km/s', '299,792,458 m/s', '186,000 miles/s', 'All of the above'], 3),
        (quiz2_id, 'Who developed the theory of relativity?', ARRAY['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Stephen Hawking'], 1),
        (quiz2_id, 'What does HTML stand for?', ARRAY['Hypertext Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'], 0)
    ON CONFLICT DO NOTHING;

    -- Insert sample questions for History Quiz
    INSERT INTO public.questions (quiz_id, question_text, options, correct_answer) VALUES
        (quiz3_id, 'Who was the first President of the United States?', ARRAY['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'], 2),
        (quiz3_id, 'In which year did the Berlin Wall fall?', ARRAY['1987', '1988', '1989', '1990'], 2),
        (quiz3_id, 'Which ancient wonder of the world was located in Alexandria?', ARRAY['Hanging Gardens', 'Lighthouse of Alexandria', 'Colossus of Rhodes', 'Temple of Artemis'], 1),
        (quiz3_id, 'Who was known as the "Iron Lady"?', ARRAY['Queen Elizabeth II', 'Margaret Thatcher', 'Indira Gandhi', 'Golda Meir'], 1),
        (quiz3_id, 'The Renaissance period began in which country?', ARRAY['France', 'Germany', 'Italy', 'Spain'], 2)
    ON CONFLICT DO NOTHING;

    -- Insert sample questions for Quick Math Challenge
    INSERT INTO public.questions (quiz_id, question_text, options, correct_answer) VALUES
        (quiz4_id, 'What is 15 × 8?', ARRAY['110', '120', '125', '130'], 1),
        (quiz4_id, 'What is the square root of 144?', ARRAY['11', '12', '13', '14'], 1),
        (quiz4_id, 'If a triangle has angles of 60°, 60°, and 60°, what type of triangle is it?', ARRAY['Right triangle', 'Isosceles triangle', 'Equilateral triangle', 'Scalene triangle'], 2),
        (quiz4_id, 'What is 25% of 200?', ARRAY['25', '50', '75', '100'], 1),
        (quiz4_id, 'What is the value of π (pi) rounded to 2 decimal places?', ARRAY['3.14', '3.15', '3.16', '3.17'], 0)
    ON CONFLICT DO NOTHING;
END $$;
