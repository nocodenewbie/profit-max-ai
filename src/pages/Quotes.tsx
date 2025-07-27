import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { CheckCircle, XCircle, Clock } from "lucide-react"

interface Quote {
  id: string
  customer_name: string | null
  customer_email: string | null
  total_value: number
  final_value: number
  discount_applied: number
  status: string
  created_at: string
  quote_items: any[]
}

export default function Quotes() {
  const { user } = useAuth()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuotes()
  }, [user])

  const loadQuotes = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('distributor_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuotes((data || []).map(quote => ({
        ...quote,
        quote_items: Array.isArray(quote.quote_items) ? quote.quote_items : []
      })))
    } catch (error) {
      console.error('Error loading quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuoteStatus = async (quoteId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ 
          status,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
          approved_by: user?.id
        })
        .eq('id', quoteId)

      if (error) throw error
      loadQuotes()
    } catch (error) {
      console.error('Error updating quote:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>
      case 'approved': return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Aprovado</Badge>
      case 'rejected': return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejeitado</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Orçamentos">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Orçamentos">
      <div className="space-y-4">
        {quotes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Nenhum orçamento encontrado</p>
            </CardContent>
          </Card>
        ) : (
          quotes.map((quote) => (
            <Card key={quote.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {quote.customer_name || 'Cliente não identificado'}
                  </CardTitle>
                  {getStatusBadge(quote.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{quote.customer_email || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="font-medium">R$ {quote.total_value.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Final</p>
                    <p className="font-medium text-green-600">R$ {quote.final_value.toFixed(2)}</p>
                  </div>
                </div>
                
                {quote.status === 'pending' && (
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      onClick={() => updateQuoteStatus(quote.id, 'approved')}
                    >
                      Aprovar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateQuoteStatus(quote.id, 'rejected')}
                    >
                      Rejeitar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  )
}