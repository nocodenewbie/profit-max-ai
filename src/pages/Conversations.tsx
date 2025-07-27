
import { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Search, 
  Eye, 
  Clock, 
  User,
  Filter,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
// Firebase integration removed for security - using Supabase instead

interface Conversation {
  id: string;
  widgetId: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  lastMessage: string;
  lastMessageTime: Date;
  status: 'active' | 'qualified' | 'converted' | 'closed';
  messageCount: number;
}

export default function Conversations() {
  const { distributorProfile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    loadConversations();
  }, [distributorProfile]);

  const loadConversations = async () => {
    if (!distributorProfile) return;

    try {
      // TODO: Implement with Supabase integration
      // For now, showing empty state as Firebase is deprecated
      setConversations([]);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'qualified': return 'Qualificada';
      case 'converted': return 'Convertida';
      case 'closed': return 'Fechada';
      default: return status;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: conversations.length,
    active: conversations.filter(c => c.status === 'active').length,
    qualified: conversations.filter(c => c.status === 'qualified').length,
    converted: conversations.filter(c => c.status === 'converted').length
  };

  if (loading) {
    return (
      <DashboardLayout title="Conversas">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>Carregando conversas...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Conversas">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Ativas</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Qualificadas</p>
                  <p className="text-2xl font-bold">{stats.qualified}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Convertidas</p>
                  <p className="text-2xl font-bold">{stats.converted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>Todas as Conversas</span>
              </CardTitle>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar conversas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma conversa encontrada</p>
                  <p className="text-sm">As conversas do widget aparecerão aqui</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div key={conversation.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {conversation.customerInfo?.name || conversation.customerInfo?.email || 'Visitante Anônimo'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {conversation.messageCount} mensagens • {conversation.lastMessageTime.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(conversation.status)}>
                          {getStatusText(conversation.status)}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-3 rounded text-sm">
                      <p className="text-muted-foreground">Última mensagem:</p>
                      <p className="mt-1">{conversation.lastMessage}</p>
                    </div>
                    
                    {conversation.customerInfo && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {conversation.customerInfo.email && (
                          <div>
                            <span className="text-muted-foreground">Email: </span>
                            <span>{conversation.customerInfo.email}</span>
                          </div>
                        )}
                        {conversation.customerInfo.phone && (
                          <div>
                            <span className="text-muted-foreground">Telefone: </span>
                            <span>{conversation.customerInfo.phone}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
