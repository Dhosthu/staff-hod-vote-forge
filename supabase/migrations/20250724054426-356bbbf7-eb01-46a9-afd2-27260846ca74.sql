-- Create enum for voter roles
CREATE TYPE public.voter_role AS ENUM ('staff', 'hod');

-- Create enum for positions
CREATE TYPE public.election_position AS ENUM ('vice_president', 'secretary', 'joint_secretary', 'associate_secretary', 'joint_treasurer');

-- Create voters table
CREATE TABLE public.voters (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT, -- Optional for staff, null for HOD
    role voter_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create candidates table
CREATE TABLE public.candidates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    position election_position NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table
CREATE TABLE public.votes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    voter_id UUID NOT NULL REFERENCES public.voters(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    position election_position NOT NULL,
    points INTEGER NOT NULL CHECK (points IN (30, 50)),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(voter_id, position) -- Ensure one vote per position per voter
);

-- Enable Row Level Security
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required for this system)
CREATE POLICY "Allow public read access to voters" ON public.voters FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to voters" ON public.voters FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to candidates" ON public.candidates FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to candidates" ON public.candidates FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to votes" ON public.votes FOR INSERT WITH CHECK (true);

-- Insert sample candidates for testing
INSERT INTO public.candidates (name, position) VALUES 
-- Vice President candidates
('John Smith', 'vice_president'),
('Emily Johnson', 'vice_president'),
('Michael Brown', 'vice_president'),

-- Secretary candidates
('Sarah Davis', 'secretary'),
('David Wilson', 'secretary'),
('Lisa Anderson', 'secretary'),

-- Joint Secretary candidates
('Robert Taylor', 'joint_secretary'),
('Jennifer Garcia', 'joint_secretary'),
('Christopher Martinez', 'joint_secretary'),

-- Associate Secretary candidates
('Amanda Rodriguez', 'associate_secretary'),
('Daniel Thompson', 'associate_secretary'),
('Michelle White', 'associate_secretary'),

-- Joint Treasurer candidates
('Kevin Lee', 'joint_treasurer'),
('Jessica Harris', 'joint_treasurer'),
('Ryan Clark', 'joint_treasurer');