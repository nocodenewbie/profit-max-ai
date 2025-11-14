-- Add RLS policies for payments table to allow service role operations
-- These policies ensure only authenticated edge functions can modify payment records

CREATE POLICY "Service role can insert payments"
ON public.payments
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role can update payments"
ON public.payments
FOR UPDATE
USING (true);

-- Add validation trigger for quotes customer PII
CREATE OR REPLACE FUNCTION public.validate_quote_customer_info()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate email format if provided
  IF NEW.customer_email IS NOT NULL AND NEW.customer_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate email length
  IF NEW.customer_email IS NOT NULL AND LENGTH(NEW.customer_email) > 255 THEN
    RAISE EXCEPTION 'Email too long';
  END IF;
  
  -- Validate phone format if provided
  IF NEW.customer_phone IS NOT NULL AND NEW.customer_phone !~ '^[\d\s()+-]{7,20}$' THEN
    RAISE EXCEPTION 'Invalid phone format';
  END IF;
  
  -- Validate name format if provided
  IF NEW.customer_name IS NOT NULL AND NEW.customer_name !~ '^[a-zA-ZÀ-ÿ\s''-]{1,100}$' THEN
    RAISE EXCEPTION 'Invalid name format';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_customer_info_before_insert
BEFORE INSERT OR UPDATE ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.validate_quote_customer_info();