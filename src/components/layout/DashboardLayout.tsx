import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Search, User, LogOut, Bot, Settings, BarChart3, MessageSquare, Package, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate, useLocation } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { distributorProfile, logout } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro no logout",
        description: "Não foi possível fazer logout",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 card-gradient border-r border-border/50 backdrop-blur-sm">
        <div className="flex h-16 items-center px-6 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 hero-gradient rounded-xl flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">MaxIA</span>
          </div>
        </div>
        
        <div className="p-4">
          <nav className="space-y-2">
            <Button 
              variant={location.pathname === "/dashboard" ? "default" : "ghost"} 
              className="w-full justify-start h-12 rounded-xl font-medium hover:bg-muted/50 transition-all duration-200" 
              asChild
            >
              <a href="/dashboard">
                <BarChart3 className="h-5 w-5 mr-3" />
                Dashboard
              </a>
            </Button>
            <Button 
              variant={location.pathname === "/conversations" ? "default" : "ghost"} 
              className="w-full justify-start h-12 rounded-xl font-medium hover:bg-muted/50 transition-all duration-200"
              asChild
            >
              <a href="/conversations">
                <MessageSquare className="h-5 w-5 mr-3" />
                Conversas
              </a>
            </Button>
            <Button 
              variant={location.pathname === "/products" ? "default" : "ghost"} 
              className="w-full justify-start h-12 rounded-xl font-medium hover:bg-muted/50 transition-all duration-200"
              asChild
            >
              <a href="/products">
                <Package className="h-5 w-5 mr-3" />
                Produtos
              </a>
            </Button>
            <Button 
              variant={location.pathname === "/quotes" ? "default" : "ghost"} 
              className="w-full justify-start h-12 rounded-xl font-medium hover:bg-muted/50 transition-all duration-200"
              asChild
            >
              <a href="/quotes">
                <FileText className="h-5 w-5 mr-3" />
                Orçamentos
              </a>
            </Button>
            <Button 
              variant={location.pathname === "/settings" ? "default" : "ghost"} 
              className="w-full justify-start h-12 rounded-xl font-medium hover:bg-muted/50 transition-all duration-200"
              asChild
            >
              <a href="/settings">
                <Settings className="h-5 w-5 mr-3" />
                Configurações
              </a>
            </Button>
            <Button 
              variant={location.pathname === "/chat-test" ? "default" : "ghost"} 
              className="w-full justify-start h-12 rounded-xl font-medium hover:bg-muted/50 transition-all duration-200 text-orange-500"
              asChild
            >
              <a href="/chat-test">
                <MessageSquare className="h-5 w-5 mr-3" />
                Chat Test (Temporário)
              </a>
            </Button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Top header */}
        <header className="card-gradient border-b border-border/50 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              {title && (
                <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Buscar..." 
                  className="pl-10 w-64 bg-muted/50 border-border/50 rounded-xl backdrop-blur-sm focus:ring-primary focus:border-primary/50"
                />
              </div>
              
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary rounded-xl">
                <Bell className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-muted/50 rounded-xl p-2">
                    <div className="w-8 h-8 hero-gradient rounded-xl flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 card-gradient border border-border/50">
                  <div className="px-3 py-2 text-sm font-medium">
                    {distributorProfile?.company_name}
                  </div>
                  <div className="px-3 py-1 text-xs text-muted-foreground">
                    {distributorProfile?.email}
                  </div>
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-muted/50">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
