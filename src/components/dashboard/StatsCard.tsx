import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("card-gradient border-border/50 hover:shadow-glow transition-all duration-300 group", className)}>
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <p className="text-muted-foreground font-medium">
              {title}
            </p>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                {value}
              </p>
              {description && (
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}
              {trend && (
                <div className="flex items-center space-x-2">
                  <span
                    className={cn(
                      "text-sm font-semibold px-2 py-1 rounded-lg",
                      trend.isPositive 
                        ? "text-success bg-success/10" 
                        : "text-destructive bg-destructive/10"
                    )}
                  >
                    {trend.isPositive ? "+" : ""}{trend.value}%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    vs mês anterior
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-primary/20 rounded-2xl group-hover:bg-primary/30 transition-colors">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}