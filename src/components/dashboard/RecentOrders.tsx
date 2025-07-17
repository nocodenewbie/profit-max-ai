import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Order {
  id: string
  customer: string
  amount: number
  status: "pending" | "processing" | "completed" | "cancelled"
  date: string
  discount: number
}

const mockOrders: Order[] = [
  {
    id: "PED-001",
    customer: "João Silva - TechCorp",
    amount: 2450.00,
    status: "completed",
    date: "2h atrás",
    discount: 10
  },
  {
    id: "PED-002", 
    customer: "Maria Santos - LogiMax",
    amount: 1890.50,
    status: "processing",
    date: "4h atrás",
    discount: 5
  },
  {
    id: "PED-003",
    customer: "Carlos Lima - IndustriaPro",
    amount: 3200.00,
    status: "pending",
    date: "6h atrás",
    discount: 15
  },
  {
    id: "PED-004",
    customer: "Ana Costa - SupplyChain",
    amount: 980.75,
    status: "completed",
    date: "1d atrás",
    discount: 0
  }
]

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800", 
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
}

const statusLabels = {
  pending: "Pendente",
  processing: "Processando",
  completed: "Concluído", 
  cancelled: "Cancelado"
}

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <div key={order.id} className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {order.customer.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{order.customer}</p>
                  <p className="text-sm font-semibold">
                    R$ {order.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="secondary" 
                      className={statusColors[order.status]}
                    >
                      {statusLabels[order.status]}
                    </Badge>
                    {order.discount > 0 && (
                      <Badge variant="outline" className="text-success">
                        -{order.discount}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}