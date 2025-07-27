-- Fix database security configurations
-- Set secure search path for functions
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';

-- Configure authentication settings for better security
-- Note: These would typically be set via Supabase dashboard
-- but including here for completeness

-- Add security trigger for distributors table to log changes
CREATE OR REPLACE FUNCTION public.log_distributor_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log security events (in production, this would go to audit table)
  RAISE LOG 'Distributor action: % on ID: %, by user: %', TG_OP, COALESCE(NEW.id, OLD.id), auth.uid();
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- Create trigger for audit logging
CREATE TRIGGER distributor_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.distributors
  FOR EACH ROW EXECUTE FUNCTION public.log_distributor_changes();