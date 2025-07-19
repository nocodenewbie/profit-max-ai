-- Create distributors table for user profiles
CREATE TABLE public.distributors (
  id UUID NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  widget_id TEXT NOT NULL UNIQUE
);

-- Enable Row Level Security
ALTER TABLE public.distributors ENABLE ROW LEVEL SECURITY;

-- Create policies for distributors
CREATE POLICY "Users can view their own distributor profile" 
ON public.distributors 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can create their own distributor profile" 
ON public.distributors 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own distributor profile" 
ON public.distributors 
FOR UPDATE 
USING (auth.uid() = id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_distributors_updated_at
  BEFORE UPDATE ON public.distributors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();