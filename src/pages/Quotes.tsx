import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Quote {
  id: string
  total_value: number
  discount_applied: number
  discount_amount: number
  final_value: number
  status: string
  customer_name: string
  customer_email: string
  customer_phone: string
  notes: string
  quote_items: any[]
  created_at: string
  expires_at: string
}

const statusConfig = {
  pending: { label: 'Pendente', color: 'secondary', icon: Clock },
  approved: { label: 'Aprovado', color: 'default', icon: CheckCircle },
  rejected: { label: 'Rejeitado', color: 'destructive', icon: XCircle }
}

export default function Quotes() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)

  useEffect(() => {
    if (user) {
      loadQuotes()
    }
  }, [user])

  const loadQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('distributor_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuotes((data || []).map(quote => ({
        ...quote,
        quote_items: Array.isArray(quote.quote_items) ? quote.quote_items : []
      })))
    } catch (error: any) {
      toast({
        title: "Erro ao carregar cotações",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateQuoteStatus = async (quoteId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ 
          status: newStatus,
          approved_at: newStatus === 'approved' ? new Date().toISOString() : null,
          approved_by: newStatus === 'approved' ? user?.id : null
        })
        .eq('id', quoteId)

      if (error) throw error

      toast({
        title: "Status atualizado",
        description: `Cotação ${newStatus === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso!`
      })
      
      loadQuotes()
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  if (loading) {
    return (
      <DashboardLayout title="Cotações">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-48 bg-muted rounded-lg"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Cotações">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Cotações Geradas</h2>
            <p className="text-muted-foreground">Gerencie as cotações criadas pela IA</p>
          </div>
          
          <div className="flex space-x-2">
            <Badge variant="outline">
              Total: {quotes.length}
            </Badge>
            <Badge variant="default">
              Aprovadas: {quotes.filter(q => q.status === 'approved').length}
            </Badge>
          </div>
        </div>

        {quotes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma cotação encontrada</h3>
              <p className="text-muted-foreground text-center">
                As cotações geradas pela IA aparecerão aqui
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => {
              const StatusIcon = statusConfig[quote.status as keyof typeof statusConfig]?.icon || Clock
              const statusInfo = statusConfig[quote.status as keyof typeof statusConfig] || statusConfig.pending
              
              return (
                <Card key={quote.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>Cotação #{quote.id.slice(-8)}</span>
                          <Badge variant={statusInfo.color as any}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          {isExpired(quote.expires_at) && quote.status === 'pending' && (
                            <Badge variant="destructive">Expirada</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {quote.customer_name} - {formatDate(quote.created_at)}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          R$ {quote.final_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        {quote.discount_applied > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Desconto: {quote.discount_applied}%
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4 text-sm text-muted-foreground">
                        {quote.customer_email && (
                          <span>📧 {quote.customer_email}</span>
                        )}
                        {quote.customer_phone && (
                          <span>📱 {quote.customer_phone}</span>
                        )}
                        <span>📅 Expira: {formatDate(quote.expires_at)}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedQuote(quote)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalhes
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Cotação #{quote.id.slice(-8)}</DialogTitle>
                              <DialogDescription>
                                Detalhes da cotação gerada pela IA
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedQuote && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Informações do Cliente</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>Nome:</strong> {selectedQuote.customer_name}</p>
                                      <p><strong>Email:</strong> {selectedQuote.customer_email}</p>
                                      <p><strong>Telefone:</strong> {selectedQuote.customer_phone}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Valores</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>Valor Total:</strong> R$ {selectedQuote.total_value.toFixed(2)}</p>
                                      <p><strong>Desconto:</strong> {selectedQuote.discount_applied}%</p>
                                      <p><strong>Valor Final:</strong> R$ {selectedQuote.final_value.toFixed(2)}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {selectedQuote.notes && (
                                  <div>
                                    <h4 className="font-medium mb-2">Observações</h4>
                                    <p className="text-sm bg-muted p-3 rounded">{selectedQuote.notes}</p>
                                  </div>
                                )}
                                
                                {selectedQuote.quote_items && selectedQuote.quote_items.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-2">Itens da Cotação</h4>
                                    <div className="border rounded">
                                      {selectedQuote.quote_items.map((item: any, index: number) => (
                                        <div key={index} className="p-3 border-b last:border-b-0">
                                          <div className="flex justify-between">
                                            <div>
                                              <p className="font-medium">{item.name || 'Item'}</p>
                                              <p className="text-sm text-muted-foreground">
                                                Qty: {item.quantity || 1}
                                              </p>
                                            </div>
                                            <div className="text-right">
                                              <p className="font-medium">R$ {(item.price || 0).toFixed(2)}</p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {quote.status === 'pending' && !isExpired(quote.expires_at) && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => updateQuoteStatus(quote.id, 'approved')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuoteStatus(quote.id, 'rejected')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rejeitar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}