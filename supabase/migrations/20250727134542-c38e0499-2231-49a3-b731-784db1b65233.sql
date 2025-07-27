-- Fix RLS policy vulnerability for distributors table
DROP POLICY IF EXISTS "Users can create their own distributor profile" ON public.distributors;

CREATE POLICY "Users can create their own distributor profile" 
ON public.distributors 
FOR INSERT 
WITH CHECK (auth.uid() = id);