import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Package2, 
  ShoppingCart, 
  Percent, 
  MessageSquare, 
  Settings,
  TrendingUp,
  Users
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

interface NavigationProps {
  className?: string
}

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    current: true
  },
  {
    name: "Produtos",
    href: "/products",
    icon: Package2,
    current: false
  },
  {
    name: "Pedidos",
    href: "/orders",
    icon: ShoppingCart,
    current: false
  },
  {
    name: "Descontos",
    href: "/discounts",
    icon: Percent,
    current: false
  },
  {
    name: "Chat IA",
    href: "/chat",
    icon: MessageSquare,
    current: false
  },
  {
    name: "Clientes",
    href: "/customers",
    icon: Users,
    current: false
  },
  {
    name: "Relatórios",
    href: "/reports",
    icon: TrendingUp,
    current: false
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: Settings,
    current: false
  }
]

export function Navigation({ className }: NavigationProps) {
  const location = useLocation()

  return (
    <nav className={cn("space-y-1", className)}>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href
        const Icon = item.icon
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              isActive
                ? "bg-gradient-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon
              className={cn(
                "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}