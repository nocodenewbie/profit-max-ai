import { Package, TrendingUp, Calendar, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Product {
  id: string
  sku: string
  product_name: string
  cost_price: number
  selling_price: number
  profit_margin: number
  category: string
  description?: string
  technical_specs?: string
}

interface ProductStatsProps {
  products: Product[]
  lastImportDate?: string
}

export function ProductStats({ products, lastImportDate }: ProductStatsProps) {
  const totalProducts = products.length
  const uniqueCategories = new Set(products.map(p => p.category)).size
  const averageMargin = products.length > 0 
    ? products.reduce((sum, p) => sum + p.profit_margin, 0) / products.length 
    : 0
  const averagePrice = products.length > 0
    ? products.reduce((sum, p) => sum + p.selling_price, 0) / products.length
    : 0

  const stats = [
    {
      title: "Total de Produtos",
      value: totalProducts.toLocaleString(),
      icon: Package,
      color: "text-primary"
    },
    {
      title: "Categorias",
      value: uniqueCategories.toString(),
      icon: BarChart3,
      color: "text-info"
    },
    {
      title: "Margem Média",
      value: `${averageMargin.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Preço Médio",
      value: `R$ ${averagePrice.toFixed(2)}`,
      icon: Calendar,
      color: "text-warning"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {index === 3 && lastImportDate && (
                <p className="text-xs text-muted-foreground">
                  Última importação: {new Date(lastImportDate).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}