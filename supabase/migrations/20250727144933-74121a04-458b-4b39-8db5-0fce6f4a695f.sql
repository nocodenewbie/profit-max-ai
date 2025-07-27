-- Create products table for distributor catalog
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  distributor_id UUID NOT NULL,
  sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  profit_margin DECIMAL(5,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  technical_specs TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(distributor_id, sku)
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Users can view their own products" 
ON public.products 
FOR SELECT 
USING (auth.uid() = distributor_id);

CREATE POLICY "Users can create their own products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.uid() = distributor_id);

CREATE POLICY "Users can update their own products" 
ON public.products 
FOR UPDATE 
USING (auth.uid() = distributor_id);

CREATE POLICY "Users can delete their own products" 
ON public.products 
FOR DELETE 
USING (auth.uid() = distributor_id);

-- Create quotes table for budget management
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  distributor_id UUID NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  quote_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_value DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount_applied DECIMAL(5,2) DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  final_value DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  conversation_id TEXT,
  widget_session_id TEXT,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 days'),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for quotes
CREATE POLICY "Users can view their own quotes" 
ON public.quotes 
FOR SELECT 
USING (auth.uid() = distributor_id);

CREATE POLICY "Users can create quotes for their business" 
ON public.quotes 
FOR INSERT 
WITH CHECK (auth.uid() = distributor_id);

CREATE POLICY "Users can update their own quotes" 
ON public.quotes 
FOR UPDATE 
USING (auth.uid() = distributor_id);

-- Create triggers for timestamps
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
BEFORE UPDATE ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_products_distributor_id ON public.products(distributor_id);
CREATE INDEX idx_products_sku ON public.products(distributor_id, sku);
CREATE INDEX idx_products_category ON public.products(distributor_id, category);
CREATE INDEX idx_quotes_distributor_id ON public.quotes(distributor_id);
CREATE INDEX idx_quotes_status ON public.quotes(distributor_id, status);
CREATE INDEX idx_quotes_conversation_id ON public.quotes(conversation_id);