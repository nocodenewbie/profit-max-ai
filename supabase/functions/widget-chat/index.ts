import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

interface WidgetChatRequest {
  message: string;
  conversationId?: string;
  distributorId: string;
  customerInfo?: {
    email?: string;
    phone?: string;
    name?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { message, conversationId, distributorId, customerInfo }: WidgetChatRequest = await req.json();

    // Input validation
    if (!message || typeof message !== 'string' || message.length > 1000) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid message format or length' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!distributorId || typeof distributorId !== 'string') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid distributor ID' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize message content to prevent XSS
    const sanitizedMessage = message.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                                   .replace(/javascript:/gi, '')
                                   .replace(/on\w+\s*=/gi, '');

    // Verify distributor exists and get configuration
    const { data: distributor, error: distributorError } = await supabase
      .from('distributors')
      .select(`
        id, 
        is_active, 
        company_name,
        distributor_configs(
          ai_personality,
          ai_instructions,
          default_discount_percentage,
          max_discount_percentage,
          volume_discount_enabled,
          minimum_order_value,
          payment_terms,
          delivery_regions,
          catalog_file_name
        )
      `)
      .eq('id', distributorId)
      .eq('is_active', true)
      .single();

    if (distributorError || !distributor) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid or inactive distributor' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get configuration or use defaults
    const config = distributor.distributor_configs?.[0] || {};
    const aiPersonality = config.ai_personality || 'Sou um vendedor especializado em produtos industriais B2B. Sou atencioso, técnico quando necessário, e focado em entender as necessidades do cliente para oferecer as melhores soluções.';
    const aiInstructions = config.ai_instructions || 'Sempre pergunte sobre quantidade, prazo de entrega e especificações técnicas. Seja proativo em sugerir produtos complementares.';
    const defaultDiscount = config.default_discount_percentage || 0;
    const maxDiscount = config.max_discount_percentage || 15;
    const minimumOrder = config.minimum_order_value || 0;
    const paymentTerms = config.payment_terms || 'À vista, 30/60/90 dias';
    const deliveryRegions = config.delivery_regions || ['Nacional'];
    const hasCatalog = config.catalog_file_name ? 'SIM' : 'NÃO';

    // Create conversation messages array
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `${aiPersonality}

INSTRUÇÕES ESPECÍFICAS:
${aiInstructions}

INFORMAÇÕES DA EMPRESA:
- Empresa: ${distributor.company_name}
- Desconto padrão disponível: ${defaultDiscount}%
- Desconto máximo autorizado: ${maxDiscount}%
- Valor mínimo de pedido: R$ ${minimumOrder.toFixed(2)}
- Condições de pagamento: ${paymentTerms}
- Regiões de entrega: ${deliveryRegions.join(', ')}
- Catálogo de produtos disponível: ${hasCatalog}

REGRAS IMPORTANTES:
- Sempre pergunte o nome do cliente no início da conversa
- Colete telefone e email se houver interesse em produtos
- Ofereça descontos dentro dos limites configurados
- Mencione as condições de pagamento quando apropriado
- Informe sobre regiões de entrega quando perguntado
- Se o cliente pedir produtos específicos, mencione que você tem acesso ao catálogo completo
- Sempre tente agendar uma reunião ou visita comercial
- Mantenha o foco em vendas e seja proativo

CONTEXTO: Você trabalha para ${distributor.company_name} e seu objetivo é converter visitantes em clientes qualificados.`
      },
      {
        role: 'user',
        content: sanitizedMessage
      }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Log the conversation for analytics (optional)
    console.log(`Widget chat for distributor ${distributorId}: User said "${sanitizedMessage}", AI responded "${aiResponse}"`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: aiResponse,
      conversationId: conversationId || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in widget-chat function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});