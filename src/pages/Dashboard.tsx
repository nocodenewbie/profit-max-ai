import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { RecentOrders } from "@/components/dashboard/RecentOrders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Users,
  MessageSquare,
  Target
} from "lucide-react"

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Receita Total"
            value="R$ 24.580"
            description="Este mês"
            icon={<DollarSign className="h-6 w-6 text-success" />}
            trend={{ value: 12.5, isPositive: true }}
          />
          
          <StatsCard
            title="Margem de Lucro"
            value="34.2%"
            description="Média do período"
            icon={<TrendingUp className="h-6 w-6 text-success" />}
            trend={{ value: 8.1, isPositive: true }}
          />
          
          <StatsCard
            title="Pedidos"
            value="127"
            description="Este mês"
            icon={<ShoppingCart className="h-6 w-6 text-primary" />}
            trend={{ value: 22.3, isPositive: true }}
          />
          
          <StatsCard
            title="Clientes Ativos"
            value="48"
            description="Únicos este mês"
            icon={<Users className="h-6 w-6 text-primary" />}
            trend={{ value: 5.2, isPositive: true }}
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>Performance da IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Taxa de Conversão</span>
                  <span className="text-lg font-semibold text-success">68.4%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ticket Médio</span>
                  <span className="text-lg font-semibold">R$ 1.847</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Upsell Success</span>
                  <span className="text-lg font-semibold text-success">43.2%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Desconto Médio</span>
                  <span className="text-lg font-semibold">8.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Produtos Top Lucro</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Parafuso Allen M8", margin: 45.2, sales: 23 },
                  { name: "Arruela Inox 6mm", margin: 38.7, sales: 19 },
                  { name: "Porca Sextavada M10", margin: 35.1, sales: 15 },
                  { name: "Chave Phillips 2.5", margin: 32.8, sales: 12 }
                ].map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} vendas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-success">{product.margin}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <RecentOrders />
      </div>
    </DashboardLayout>
  )
}