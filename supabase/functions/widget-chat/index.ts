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

    // Verify distributor exists
    const { data: distributor, error: distributorError } = await supabase
      .from('distributors')
      .select('id, is_active')
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

    // Create conversation messages array
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `Você é Max, um vendedor virtual inteligente especializado em atendimento comercial. 

INSTRUÇÕES IMPORTANTES:
- Seja sempre cordial, profissional e focado em vendas
- Faça perguntas para entender melhor as necessidades do cliente
- Sempre tente direcionar a conversa para uma venda ou agendamento
- Se o cliente demonstrar interesse, colete informações de contato (nome, telefone, email)
- Responda sempre em português brasileiro
- Mantenha respostas concisas e objetivas
- Se não souber sobre um produto específico, seja honesto mas mantenha o interesse

CONTEXTO: Você trabalha para uma distribuidora/empresa e seu objetivo é converter visitantes em clientes.`
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