import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Upload, Download, Settings2, Bot, Percent, FileText, DollarSign, Globe } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Badge } from "@/components/ui/badge"

interface DistributorConfig {
  id?: string
  ai_personality: string
  ai_instructions: string
  default_discount_percentage: number
  max_discount_percentage: number
  volume_discount_enabled: boolean
  volume_discount_rules: any
  catalog_file_url?: string
  catalog_file_name?: string
  catalog_uploaded_at?: string
  minimum_order_value: number
  payment_terms: string
  delivery_regions: string[]
}

export default function Settings() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [config, setConfig] = useState<DistributorConfig>({
    ai_personality: 'Sou um vendedor especializado em produtos industriais B2B. Sou atencioso, técnico quando necessário, e focado em entender as necessidades do cliente para oferecer as melhores soluções.',
    ai_instructions: 'Sempre pergunte sobre quantidade, prazo de entrega e especificações técnicas. Seja proativo em sugerir produtos complementares.',
    default_discount_percentage: 0,
    max_discount_percentage: 15,
    volume_discount_enabled: true,
    volume_discount_rules: [],
    minimum_order_value: 0,
    payment_terms: 'À vista, 30/60/90 dias',
    delivery_regions: ['Nacional']
  })

  useEffect(() => {
    loadConfig()
  }, [user])

  const loadConfig = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('distributor_configs')
        .select('*')
        .eq('distributor_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setConfig({
          ...data,
          volume_discount_rules: Array.isArray(data.volume_discount_rules) ? data.volume_discount_rules : [],
          delivery_regions: Array.isArray(data.delivery_regions) ? data.delivery_regions : ['Nacional']
        })
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar configurações",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('distributor_configs')
        .upsert({
          ...config,
          distributor_id: user.id
        })
        .select()
        .single()

      if (error) throw error

      setConfig({
        ...data,
        volume_discount_rules: Array.isArray(data.volume_discount_rules) ? data.volume_discount_rules : [],
        delivery_regions: Array.isArray(data.delivery_regions) ? data.delivery_regions : ['Nacional']
      })
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso!"
      })
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    try {
      const fileName = `${user.id}/${Date.now()}-${file.name}`
      
      const { error: uploadError } = await supabase.storage
        .from('product-catalogs')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('product-catalogs')
        .getPublicUrl(fileName)

      setConfig(prev => ({
        ...prev,
        catalog_file_url: urlData.publicUrl,
        catalog_file_name: file.name,
        catalog_uploaded_at: new Date().toISOString()
      }))

      toast({
        title: "Catálogo enviado",
        description: "Arquivo carregado com sucesso!"
      })
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Configurações">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-48 bg-muted rounded-lg"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Configurações">
      <div className="space-y-6">
        {/* AI Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary" />
              <span>Configuração da IA</span>
            </CardTitle>
            <CardDescription>
              Defina a personalidade e instruções para o vendedor virtual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ai_personality">Personalidade da IA</Label>
              <Textarea
                id="ai_personality"
                placeholder="Como a IA deve se apresentar aos visitantes..."
                value={config.ai_personality}
                onChange={(e) => setConfig(prev => ({ ...prev, ai_personality: e.target.value }))}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="ai_instructions">Instruções Específicas</Label>
              <Textarea
                id="ai_instructions"
                placeholder="Diretrizes específicas sobre como atuar nas vendas..."
                value={config.ai_instructions}
                onChange={(e) => setConfig(prev => ({ ...prev, ai_instructions: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Discount Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Percent className="h-5 w-5 text-success" />
              <span>Configuração de Descontos</span>
            </CardTitle>
            <CardDescription>
              Configure os descontos que a IA pode oferecer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="default_discount">Desconto Padrão (%)</Label>
                <Input
                  id="default_discount"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={config.default_discount_percentage}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    default_discount_percentage: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="max_discount">Desconto Máximo (%)</Label>
                <Input
                  id="max_discount"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={config.max_discount_percentage}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    max_discount_percentage: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="volume_discount"
                checked={config.volume_discount_enabled}
                onCheckedChange={(checked) => setConfig(prev => ({ 
                  ...prev, 
                  volume_discount_enabled: checked 
                }))}
              />
              <Label htmlFor="volume_discount">Habilitar desconto por volume</Label>
            </div>
          </CardContent>
        </Card>

        {/* Product Catalog */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-info" />
              <span>Catálogo de Produtos</span>
            </CardTitle>
            <CardDescription>
              Faça upload do catálogo para que a IA conheça seus produtos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.catalog_file_name ? (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{config.catalog_file_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Enviado em {new Date(config.catalog_uploaded_at!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Ativo</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(config.catalog_file_url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Baixar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground mb-2">Nenhum catálogo enviado</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Formatos aceitos: PDF, Excel, CSV
                </p>
              </div>
            )}
            
            <div>
              <Label htmlFor="catalog_upload">Novo Catálogo</Label>
              <Input
                id="catalog_upload"
                type="file"
                accept=".pdf,.xlsx,.xls,.csv"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-muted-foreground mt-1">Enviando arquivo...</p>}
            </div>
          </CardContent>
        </Card>

        {/* Business Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings2 className="h-5 w-5 text-warning" />
              <span>Regras de Negócio</span>
            </CardTitle>
            <CardDescription>
              Configure as regras básicas de vendas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="minimum_order">Valor Mínimo do Pedido (R$)</Label>
              <Input
                id="minimum_order"
                type="number"
                min="0"
                step="0.01"
                value={config.minimum_order_value}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  minimum_order_value: parseFloat(e.target.value) || 0 
                }))}
              />
            </div>
            <div>
              <Label htmlFor="payment_terms">Condições de Pagamento</Label>
              <Input
                id="payment_terms"
                value={config.payment_terms}
                onChange={(e) => setConfig(prev => ({ ...prev, payment_terms: e.target.value }))}
                placeholder="Ex: À vista, 30/60/90 dias"
              />
            </div>
            <div>
              <Label htmlFor="delivery_regions">Regiões de Entrega</Label>
              <Input
                id="delivery_regions"
                value={config.delivery_regions.join(', ')}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  delivery_regions: e.target.value.split(',').map(r => r.trim()) 
                }))}
                placeholder="Ex: Nacional, Sul, Sudeste"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveConfig} disabled={saving} size="lg">
            {saving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}