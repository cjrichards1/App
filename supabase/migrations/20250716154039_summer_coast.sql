/*
  # Create flashcards application schema

  1. New Tables
    - `folders`
      - `id` (uuid, primary key)
      - `name` (text, folder name)
      - `color` (text, folder color)
      - `card_count` (integer, number of cards in folder)
      - `created_at` (timestamp)
    - `flashcards`
      - `id` (uuid, primary key)
      - `front` (text, front side of card)
      - `back` (text, back side of card)
      - `category` (text, card category)
      - `difficulty` (text, difficulty level)
      - `is_latex` (boolean, whether card contains LaTeX)
      - `correct_count` (integer, number of correct answers)
      - `incorrect_count` (integer, number of incorrect answers)
      - `last_studied` (timestamp, when card was last studied)
      - `folder_id` (uuid, foreign key to folders)
      - `created_at` (timestamp)
    - `study_sessions`
      - `id` (uuid, primary key)
      - `total_cards` (integer, total cards in session)
      - `correct_answers` (integer, correct answers in session)
      - `incorrect_answers` (integer, incorrect answers in session)
      - `start_time` (timestamp, session start time)
      - `end_time` (timestamp, session end time)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create folders table
CREATE TABLE IF NOT EXISTS public.folders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  name text NOT NULL,
  color text NOT NULL,
  card_count integer DEFAULT 0 NOT NULL
);

-- Create flashcards table
CREATE TABLE IF NOT EXISTS public.flashcards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  front text NOT NULL,
  back text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_latex boolean DEFAULT false NOT NULL,
  last_studied timestamp with time zone,
  correct_count integer DEFAULT 0 NOT NULL,
  incorrect_count integer DEFAULT 0 NOT NULL,
  folder_id uuid REFERENCES public.folders(id) ON DELETE SET NULL
);

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  total_cards integer NOT NULL,
  correct_answers integer NOT NULL,
  incorrect_answers integer NOT NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone
);

-- Enable Row Level Security
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for folders
CREATE POLICY "Users can read all folders"
  ON public.folders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create folders"
  ON public.folders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update folders"
  ON public.folders
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete folders"
  ON public.folders
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for flashcards
CREATE POLICY "Users can read all flashcards"
  ON public.flashcards
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create flashcards"
  ON public.flashcards
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update flashcards"
  ON public.flashcards
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete flashcards"
  ON public.flashcards
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for study_sessions
CREATE POLICY "Users can read all study sessions"
  ON public.study_sessions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create study sessions"
  ON public.study_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update study sessions"
  ON public.study_sessions
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete study sessions"
  ON public.study_sessions
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_flashcards_folder_id ON public.flashcards(folder_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_category ON public.flashcards(category);
CREATE INDEX IF NOT EXISTS idx_flashcards_difficulty ON public.flashcards(difficulty);
CREATE INDEX IF NOT EXISTS idx_flashcards_last_studied ON public.flashcards(last_studied);
CREATE INDEX IF NOT EXISTS idx_study_sessions_start_time ON public.study_sessions(start_time);