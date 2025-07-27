
// This file is deprecated and replaced by the secure Edge Function at supabase/functions/widget-chat
// It remains here for backwards compatibility but should not be used in production

console.warn('Using deprecated widget API - please migrate to Edge Functions');

// OpenAI Integration - DEPRECATED: Use Edge Functions instead
const OPENAI_API_KEY = ""; // Removed for security - use Edge Functions

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface WidgetChatRequest {
  widgetId: string;
  message: string;
  conversationId?: string;
}

interface Conversation {
  id: string;
  widgetId: string;
  distributorId: string;
  messages: ChatMessage[];
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  extractedOrder?: {
    products: string[];
    quantities: number[];
    totalValue?: number;
    deadline?: string;
    status: 'potential' | 'confirmed' | 'completed';
  };
  createdAt: Date;
  updatedAt: Date;
}

// System prompt for the AI sales assistant
const SYSTEM_PROMPT = `Você é um vendedor virtual inteligente especializado em vendas B2B de produtos industriais, ferramentas e equipamentos.

OBJETIVOS:
1. Entender as necessidades do cliente de forma natural e amigável
2. Fazer perguntas qualificadoras para identificar produtos específicos
3. Coletar informações de contato quando apropriado
4. Gerar leads qualificados e pedidos estruturados

DIRETRIZES:
- Seja profissional, prestativo e direto
- Faça perguntas específicas sobre produtos, quantidades e prazos
- Identifique oportunidades de venda adicional (upsell/cross-sell)
- Colete nome, email, telefone e empresa quando necessário
- Mantenha um tom consultivo, não apenas vendedor
- Use linguagem brasileira coloquial mas profissional

INFORMAÇÕES A EXTRAIR:
- Produtos de interesse (nomes específicos, códigos, especificações)
- Quantidades necessárias
- Prazo de entrega desejado
- Dados de contato (nome, email, telefone, empresa)
- Orçamento aproximado se possível

Quando tiver informações suficientes para um pedido, estruture os dados de forma clara.`;

export async function handleWidgetChat(request: WidgetChatRequest) {
  console.warn('DEPRECATED: This function is deprecated. Use the Edge Function at /supabase/functions/widget-chat instead');
  
  return {
    success: false,
    response: 'Este serviço foi migrado para um sistema mais seguro. Entre em contato com o suporte.',
    error: 'Service migrated to Edge Functions'
  };
}

async function callOpenAI(messages: ChatMessage[]): Promise<string> {
  try {
    // This is a placeholder - in production, this should be called from a secure backend
    // For now, we'll return a mock response
    
    // In production, you would do:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
    */
    
    // Mock response for demonstration
    const userMessage = messages[messages.length - 1].content.toLowerCase();
    
    if (userMessage.includes('parafuso') || userMessage.includes('ferramenta')) {
      return 'Entendi que você está procurando por parafusos ou ferramentas! Posso ajudá-lo a encontrar exatamente o que precisa. Poderia me dar mais detalhes sobre:\n\n• Tipo específico do parafuso (Allen, Phillips, fenda?)\n• Medidas necessárias (diâmetro x comprimento)\n• Material preferido (aço, inox, etc.)\n• Quantidade aproximada\n\nTambém gostaria de saber seu nome e empresa para preparar um orçamento personalizado!';
    }
    
    if (userMessage.includes('oi') || userMessage.includes('olá') || userMessage.includes('bom dia')) {
      return 'Olá! Seja muito bem-vindo! Sou o assistente virtual especializado em produtos industriais e ferramentas. Estou aqui para ajudá-lo a encontrar exatamente o que sua empresa precisa.\n\nEm que posso ajudá-lo hoje? Está procurando algum produto específico?';
    }
    
    if (userMessage.includes('orçamento') || userMessage.includes('preço') || userMessage.includes('valor')) {
      return 'Perfeito! Para preparar um orçamento detalhado e personalizado, preciso de algumas informações:\n\n• Lista dos produtos de interesse\n• Quantidades necessárias\n• Prazo desejado para entrega\n• Seu nome e empresa\n• Email para envio do orçamento\n\nPoderia me fornecer esses dados?';
    }
    
    return 'Obrigado pela sua mensagem! Estou aqui para ajudá-lo com produtos industriais, ferramentas e equipamentos. Poderia me dar mais detalhes sobre o que está procurando? Assim posso oferecer as melhores opções para sua empresa.';
    
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'Desculpe, estou com dificuldades técnicas no momento. Poderia tentar novamente?';
  }
}

async function extractOrderData(conversationId: string, messages: ChatMessage[], distributorId: string) {
  console.warn('DEPRECATED: extractOrderData function is deprecated');
  // This functionality has been moved to the Edge Function
}
