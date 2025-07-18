
import { db } from '@/config/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';

// OpenAI Integration (will be moved to environment variables)
const OPENAI_API_KEY = 'your-openai-api-key'; // This should be in environment variables

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
  try {
    // Get distributor info from widget ID
    const distributorsQuery = query(
      collection(db, 'distributors'),
      where('widgetId', '==', request.widgetId)
    );
    
    const distributorSnapshot = await getDocs(distributorsQuery);
    
    if (distributorSnapshot.empty) {
      throw new Error('Widget ID não encontrado');
    }
    
    const distributorDoc = distributorSnapshot.docs[0];
    const distributorData = distributorDoc.data();
    const distributorId = distributorDoc.id;
    
    // Get or create conversation
    let conversation: Conversation;
    let conversationRef;
    
    if (request.conversationId) {
      // Get existing conversation
      conversationRef = doc(db, 'conversations', request.conversationId);
      const conversationSnap = await getDoc(conversationRef);
      
      if (conversationSnap.exists()) {
        const conversationData = conversationSnap.data() as Omit<Conversation, 'id'>;
        conversation = { id: conversationSnap.id, ...conversationData };
      } else {
        throw new Error('Conversa não encontrada');
      }
    } else {
      // Create new conversation
      const newConversation = {
        widgetId: request.widgetId,
        distributorId: distributorId,
        messages: [
          {
            role: 'system' as const,
            content: SYSTEM_PROMPT
          }
        ],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      conversationRef = await addDoc(collection(db, 'conversations'), newConversation);
      conversation = {
        id: conversationRef.id,
        ...newConversation,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Conversation;
    }
    
    // Add user message to conversation
    const updatedMessages = [
      ...conversation.messages,
      {
        role: 'user' as const,
        content: request.message
      }
    ];
    
    // Call OpenAI API
    const aiResponse = await callOpenAI(updatedMessages);
    
    // Add AI response to messages
    const finalMessages = [
      ...updatedMessages,
      {
        role: 'assistant' as const,
        content: aiResponse
      }
    ];
    
    // Update conversation in Firestore
    await updateDoc(conversationRef, {
      messages: finalMessages,
      updatedAt: serverTimestamp()
    });
    
    // Try to extract structured data from conversation
    await extractOrderData(conversation.id, finalMessages, distributorId);
    
    return {
      success: true,
      response: aiResponse,
      conversationId: conversation.id
    };
    
  } catch (error) {
    console.error('Widget chat error:', error);
    return {
      success: false,
      response: 'Desculpe, ocorreu um erro interno. Tente novamente em alguns momentos.',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
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
  try {
    // Analyze conversation to extract potential order data
    const conversationText = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
    
    // Simple extraction logic (in production, this would use more sophisticated NLP)
    const extractedData = {
      products: [] as string[],
      customerInfo: {} as any,
      hasOrderIntent: false
    };
    
    // Extract products (simple keyword matching)
    const productKeywords = ['parafuso', 'porca', 'arruela', 'chave', 'furadeira', 'broca', 'serra'];
    productKeywords.forEach(keyword => {
      if (conversationText.toLowerCase().includes(keyword)) {
        extractedData.products.push(keyword);
      }
    });
    
    // Extract email
    const emailMatch = conversationText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) {
      extractedData.customerInfo.email = emailMatch[0];
    }
    
    // Extract phone
    const phoneMatch = conversationText.match(/\b\(?([0-9]{2})\)?\s?([0-9]{4,5})-?([0-9]{4})\b/);
    if (phoneMatch) {
      extractedData.customerInfo.phone = phoneMatch[0];
    }
    
    // Check for order intent
    const orderKeywords = ['orçamento', 'comprar', 'pedido', 'preço', 'valor', 'quantidade'];
    extractedData.hasOrderIntent = orderKeywords.some(keyword => 
      conversationText.toLowerCase().includes(keyword)
    );
    
    // If we have enough data, create/update an order
    if (extractedData.hasOrderIntent && (extractedData.products.length > 0 || extractedData.customerInfo.email)) {
      const orderData = {
        conversationId,
        distributorId,
        products: extractedData.products,
        customerInfo: extractedData.customerInfo,
        status: 'potential' as const,
        source: 'widget',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'orders'), orderData);
    }
    
  } catch (error) {
    console.error('Error extracting order data:', error);
  }
}
