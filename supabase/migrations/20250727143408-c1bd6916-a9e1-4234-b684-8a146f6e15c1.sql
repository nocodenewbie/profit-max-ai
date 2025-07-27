-- Create table for distributor configurations
CREATE TABLE public.distributor_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  distributor_id UUID NOT NULL REFERENCES distributors(id) ON DELETE CASCADE,
  
  -- AI Configuration
  ai_personality TEXT DEFAULT 'Sou um vendedor especializado em produtos industriais B2B. Sou atencioso, técnico quando necessário, e focado em entender as necessidades do cliente para oferecer as melhores soluções.',
  ai_instructions TEXT DEFAULT 'Sempre pergunte sobre quantidade, prazo de entrega e especificações técnicas. Seja proativo em sugerir produtos complementares.',
  
  -- Discount Configuration
  default_discount_percentage DECIMAL(5,2) DEFAULT 0.00,
  max_discount_percentage DECIMAL(5,2) DEFAULT 15.00,
  volume_discount_enabled BOOLEAN DEFAULT true,
  volume_discount_rules JSONB DEFAULT '[]',
  
  -- Product Catalog
  catalog_file_url TEXT,
  catalog_file_name TEXT,
  catalog_uploaded_at TIMESTAMP WITH TIME ZONE,
  
  -- Business Rules
  minimum_order_value DECIMAL(10,2) DEFAULT 0.00,
  payment_terms TEXT DEFAULT 'À vista, 30/60/90 dias',
  delivery_regions TEXT[] DEFAULT ARRAY['Nacional'],
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.distributor_configs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own config" 
ON public.distributor_configs 
FOR SELECT 
USING (distributor_id = auth.uid());

CREATE POLICY "Users can create their own config" 
ON public.distributor_configs 
FOR INSERT 
WITH CHECK (distributor_id = auth.uid());

CREATE POLICY "Users can update their own config" 
ON public.distributor_configs 
FOR UPDATE 
USING (distributor_id = auth.uid());

-- Create trigger for timestamps
CREATE TRIGGER update_distributor_configs_updated_at
BEFORE UPDATE ON public.distributor_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for catalogs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-catalogs', 'product-catalogs', false);

-- Create storage policies
CREATE POLICY "Users can upload their own catalogs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-catalogs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own catalogs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-catalogs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own catalogs" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-catalogs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own catalogs" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-catalogs' AND auth.uid()::text = (storage.foldername(name))[1]);