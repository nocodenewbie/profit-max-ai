import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { WidgetSnippet } from "@/components/distributor/WidgetSnippet"
import { OrdersList } from "@/components/distributor/OrdersList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Users,
  MessageSquare,
  Bot,
  Activity,
  Clock
} from "lucide-react"

export default function Dashboard() {
  const { distributorProfile } = useAuth()

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="bg-gradient-primary p-6 rounded-lg text-primary-foreground">
          <div className="flex items-center space-x-4">
            <Bot className="h-12 w-12" />
            <div>
              <h2 className="text-2xl font-bold">Bem-vindo, {distributorProfile?.companyName}!</h2>
              <p className="text-primary-foreground/80">
                Seu vendedor virtual está funcionando 24/7 para converter visitantes em pedidos.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Conversas do Mês"
            value="342"
            description="Interações do widget"
            icon={<MessageSquare className="h-6 w-6 text-primary" />}
            trend={{ value: 28.5, isPositive: true }}
          />
          
          <StatsCard
            title="Taxa de Conversão"
            value="68.4%"
            description="Conversas → Pedidos"
            icon={<TrendingUp className="h-6 w-6 text-success" />}
            trend={{ value: 12.1, isPositive: true }}
          />
          
          <StatsCard
            title="Pedidos Gerados"
            value="127"
            description="Este mês"
            icon={<ShoppingCart className="h-6 w-6 text-primary" />}
            trend={{ value: 22.3, isPositive: true }}
          />
          
          <StatsCard
            title="Valor Total"
            value="R$ 248.650"
            description="Vendas via widget"
            icon={<DollarSign className="h-6 w-6 text-success" />}
            trend={{ value: 35.2, isPositive: true }}
          />
        </div>

        {/* Widget Configuration */}
        <WidgetSnippet />

        {/* Performance Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-primary" />
                <span>Performance da IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tempo Médio de Resposta</span>
                  <span className="text-lg font-semibold text-primary">1.2s</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ticket Médio</span>
                  <span className="text-lg font-semibold">R$ 1.956</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Satisfação do Cliente</span>
                  <span className="text-lg font-semibold text-success">4.8/5</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Upsell Success</span>
                  <span className="text-lg font-semibold text-success">43.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Atividade Recente</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: "há 2 min", action: "Novo pedido de R$ 3.240", customer: "João Silva" },
                  { time: "há 8 min", action: "Conversa iniciada", customer: "Maria Santos" },
                  { time: "há 15 min", action: "Pedido convertido R$ 1.890", customer: "Pedro Costa" },
                  { time: "há 23 min", action: "Nova visita no widget", customer: "Ana Oliveira" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <OrdersList />
      </div>
    </DashboardLayout>
  )
}