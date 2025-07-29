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
        <div className="hero-gradient p-8 rounded-2xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="relative flex items-center space-x-6">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Bot className="h-16 w-16" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Bem-vindo, {distributorProfile?.company_name}!</h2>
              <p className="text-white/90 text-lg">
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
          <Card className="card-gradient border-border/50 hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-primary/20 rounded-xl">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl">Performance da IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                  <span className="text-muted-foreground">Tempo Médio de Resposta</span>
                  <span className="text-xl font-bold text-primary">1.2s</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                  <span className="text-muted-foreground">Ticket Médio</span>
                  <span className="text-xl font-bold">R$ 1.956</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                  <span className="text-muted-foreground">Satisfação do Cliente</span>
                  <span className="text-xl font-bold text-success">4.8/5</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                  <span className="text-muted-foreground">Upsell Success</span>
                  <span className="text-xl font-bold text-success">43.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-border/50 hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-primary/20 rounded-xl">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl">Atividade Recente</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "há 2 min", action: "Novo pedido de R$ 3.240", customer: "João Silva" },
                  { time: "há 8 min", action: "Conversa iniciada", customer: "Maria Santos" },
                  { time: "há 15 min", action: "Pedido convertido R$ 1.890", customer: "Pedro Costa" },
                  { time: "há 23 min", action: "Nova visita no widget", customer: "Ana Oliveira" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
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