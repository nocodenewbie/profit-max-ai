import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Eye, 
  Calendar,
  User,
  Package,
  Clock
} from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  products: string[];
  totalValue: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
  source: string;
}

// Mock data - in production this would come from Firestore
const mockOrders: Order[] = [
  {
    id: '001',
    customerName: 'João Silva',
    email: 'joao@empresa.com',
    phone: '(11) 99999-9999',
    products: ['Parafuso Allen M8 x 50', 'Arruela Inox 6mm'],
    totalValue: 2450.00,
    status: 'pending',
    createdAt: new Date('2024-01-15'),
    source: 'Widget - Site Principal'
  },
  {
    id: '002',
    customerName: 'Maria Santos',
    email: 'maria@industria.com',
    phone: '(11) 88888-8888',
    products: ['Porca Sextavada M10', 'Chave Phillips 2.5'],
    totalValue: 1890.00,
    status: 'processing',
    createdAt: new Date('2024-01-14'),
    source: 'Widget - Loja Online'
  },
  {
    id: '003',
    customerName: 'Pedro Costa',
    email: 'pedro@metalurgica.com',
    phone: '(11) 77777-7777',
    products: ['Kit Parafusos Variados', 'Furadeira Industrial'],
    totalValue: 5670.00,
    status: 'completed',
    createdAt: new Date('2024-01-13'),
    source: 'Widget - Site Principal'
  }
];

export function OrdersList() {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'processing': return 'Processando';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <span>Pedidos do Widget</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pedidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum pedido encontrado</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{order.customerName}</h3>
                      <p className="text-sm text-muted-foreground">Pedido #{order.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Contato</p>
                      <p className="text-muted-foreground">{order.email}</p>
                      <p className="text-muted-foreground">{order.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Produtos</p>
                      <p className="text-muted-foreground">{order.products.length} itens</p>
                      <p className="text-muted-foreground">{order.products[0]}{order.products.length > 1 ? ` +${order.products.length - 1}` : ''}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Data</p>
                      <p className="text-muted-foreground">{order.createdAt.toLocaleDateString('pt-BR')}</p>
                      <p className="text-muted-foreground">{order.source}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Valor</p>
                      <p className="text-lg font-semibold text-success">
                        R$ {order.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}