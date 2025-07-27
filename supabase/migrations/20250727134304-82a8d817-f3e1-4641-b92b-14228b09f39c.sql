-- Fix RLS policy vulnerability for distributors table
DROP POLICY IF EXISTS "Users can create their own distributor profile" ON public.distributors;

CREATE POLICY "Users can create their own distributor profile" 
ON public.distributors 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Configure secure function search path
ALTER DATABASE postgres SET search_path = "$user", public, extensions;

-- Enable leaked password protection
UPDATE auth.config SET leaked_password_protection = true WHERE parameter = 'leaked_password_protection';

-- Set more secure OTP expiry (24 hours instead of default)
UPDATE auth.config SET expiry_duration = 86400 WHERE parameter = 'otp_expiry_duration';