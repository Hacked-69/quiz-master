-- Insert mock quizzes (you'll need to replace the UUIDs with actual user IDs from your auth.users table)
-- For demo purposes, we'll create some sample data

-- First, let's create a sample user (this would normally be done through Supabase Auth)
-- Note: In a real app, users are created through the auth system, not directly in the database

-- Insert sample quizzes
INSERT INTO public.quizzes (id, title, description, time_limit, created_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'General Knowledge Quiz', 'Test your general knowledge with this fun quiz!', 15, '550e8400-e29b-41d4-a716-446655440000'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Science & Technology', 'Questions about science, technology, and innovation', 20, '550e8400-e29b-41d4-a716-446655440000'),
    ('550e8400-e29b-41d4-a716-446655440003', 'History Quiz', 'Test your knowledge of world history', 25, '550e8400-e29b-41d4-a716-446655440000'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Quick Math Challenge', 'Fast-paced math questions for sharp minds', 10, '550e8400-e29b-41d4-a716-446655440000');

-- Insert sample questions for General Knowledge Quiz
INSERT INTO public.questions (quiz_id, question_text, options, correct_answer) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'What is the capital of France?', ARRAY['London', 'Berlin', 'Paris', 'Madrid'], 2),
    ('550e8400-e29b-41d4-a716-446655440001', 'Which planet is known as the Red Planet?', ARRAY['Venus', 'Mars', 'Jupiter', 'Saturn'], 1),
    ('550e8400-e29b-41d4-a716-446655440001', 'Who painted the Mona Lisa?', ARRAY['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'], 2),
    ('550e8400-e29b-41d4-a716-446655440001', 'What is the largest ocean on Earth?', ARRAY['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'], 3),
    ('550e8400-e29b-41d4-a716-446655440001', 'In which year did World War II end?', ARRAY['1944', '1945', '1946', '1947'], 1);

-- Insert sample questions for Science & Technology Quiz
INSERT INTO public.questions (quiz_id, question_text, options, correct_answer) VALUES
    ('550e8400-e29b-41d4-a716-446655440002', 'What does CPU stand for?', ARRAY['Central Processing Unit', 'Computer Personal Unit', 'Central Program Unit', 'Computer Processing Unit'], 0),
    ('550e8400-e29b-41d4-a716-446655440002', 'Which element has the chemical symbol "O"?', ARRAY['Gold', 'Silver', 'Oxygen', 'Iron'], 2),
    ('550e8400-e29b-41d4-a716-446655440002', 'What is the speed of light in vacuum?', ARRAY['300,000 km/s', '299,792,458 m/s', '186,000 miles/s', 'All of the above'], 3),
    ('550e8400-e29b-41d4-a716-446655440002', 'Who developed the theory of relativity?', ARRAY['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Stephen Hawking'], 1),
    ('550e8400-e29b-41d4-a716-446655440002', 'What does HTML stand for?', ARRAY['Hypertext Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'], 0);

-- Insert sample questions for History Quiz
INSERT INTO public.questions (quiz_id, question_text, options, correct_answer) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', 'Who was the first President of the United States?', ARRAY['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'], 2),
    ('550e8400-e29b-41d4-a716-446655440003', 'In which year did the Berlin Wall fall?', ARRAY['1987', '1988', '1989', '1990'], 2),
    ('550e8400-e29b-41d4-a716-446655440003', 'Which ancient wonder of the world was located in Alexandria?', ARRAY['Hanging Gardens', 'Lighthouse of Alexandria', 'Colossus of Rhodes', 'Temple of Artemis'], 1),
    ('550e8400-e29b-41d4-a716-446655440003', 'Who was known as the "Iron Lady"?', ARRAY['Queen Elizabeth II', 'Margaret Thatcher', 'Indira Gandhi', 'Golda Meir'], 1),
    ('550e8400-e29b-41d4-a716-446655440003', 'The Renaissance period began in which country?', ARRAY['France', 'Germany', 'Italy', 'Spain'], 2);

-- Insert sample questions for Quick Math Challenge
INSERT INTO public.questions (quiz_id, question_text, options, correct_answer) VALUES
    ('550e8400-e29b-41d4-a716-446655440004', 'What is 15 × 8?', ARRAY['110', '120', '125', '130'], 1),
    ('550e8400-e29b-41d4-a716-446655440004', 'What is the square root of 144?', ARRAY['11', '12', '13', '14'], 1),
    ('550e8400-e29b-41d4-a716-446655440004', 'If a triangle has angles of 60°, 60°, and 60°, what type of triangle is it?', ARRAY['Right triangle', 'Isosceles triangle', 'Equilateral triangle', 'Scalene triangle'], 2),
    ('550e8400-e29b-41d4-a716-446655440004', 'What is 25% of 200?', ARRAY['25', '50', '75', '100'], 1),
    ('550e8400-e29b-41d4-a716-446655440004', 'What is the value of π (pi) rounded to 2 decimal places?', ARRAY['3.14', '3.15', '3.16', '3.17'], 0);
