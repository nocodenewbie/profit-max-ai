import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { useEffect, useState } from "react"
import { MessageSquare, TrendingUp, ShoppingCart, DollarSign } from "lucide-react"

interface StatsData {
  quotesCount: number
  quotesValue: number
  avgOrderValue: number
  conversionRate: number
}

export function RealStatsCard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<StatsData>({
    quotesCount: 0,
    quotesValue: 0,
    avgOrderValue: 0,
    conversionRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadStats()
    }
  }, [user])

  const loadStats = async () => {
    try {
      // Get quotes data
      const { data: quotes, error } = await supabase
        .from('quotes')
        .select('final_value, status')
        .eq('distributor_id', user?.id)

      if (error) throw error

      const quotesCount = quotes?.length || 0
      const quotesValue = quotes?.reduce((sum, quote) => sum + Number(quote.final_value), 0) || 0
      const avgOrderValue = quotesCount > 0 ? quotesValue / quotesCount : 0
      const conversionRate = quotesCount > 0 ? (quotes?.filter(q => q.status === 'approved').length / quotesCount) * 100 : 0

      setStats({
        quotesCount,
        quotesValue,
        avgOrderValue,
        conversionRate
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="card-gradient border-border/50 hover:shadow-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cotações Geradas</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.quotesCount}</div>
          <p className="text-xs text-muted-foreground">
            Total de cotações via widget
          </p>
        </CardContent>
      </Card>

      <Card className="card-gradient border-border/50 hover:shadow-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Cotações aprovadas
          </p>
        </CardContent>
      </Card>

      <Card className="card-gradient border-border/50 hover:shadow-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {stats.avgOrderValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <p className="text-xs text-muted-foreground">
            Por cotação
          </p>
        </CardContent>
      </Card>

      <Card className="card-gradient border-border/50 hover:shadow-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {stats.quotesValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <p className="text-xs text-muted-foreground">
            Em cotações geradas
          </p>
        </CardContent>
      </Card>
    </div>
  )
}