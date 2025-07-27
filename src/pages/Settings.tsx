import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Upload, Download, Settings2, Bot, Percent, FileText, DollarSign, Globe, Plus, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Badge } from "@/components/ui/badge"

interface DiscountTier {
  min_value: number
  discount_percentage: number
}

interface DistributorConfig {
  id?: string
  ai_personality: string
  ai_instructions: string
  default_discount_percentage: number
  max_discount_percentage: number
  volume_discount_enabled: boolean
  volume_discount_rules: DiscountTier[]
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
          volume_discount_rules: Array.isArray(data.volume_discount_rules) 
            ? (data.volume_discount_rules as unknown as DiscountTier[])
            : [],
          delivery_regions: Array.isArray(data.delivery_regions) 
            ? (data.delivery_regions as unknown as string[])
            : ['Nacional']
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
      const configToSave = {
        ...config,
        distributor_id: user.id,
        volume_discount_rules: config.volume_discount_rules as any,
        delivery_regions: config.delivery_regions as any
      }

      const { data, error } = await supabase
        .from('distributor_configs')
        .upsert(configToSave)
        .select()
        .single()

      if (error) throw error

      setConfig({
        ...data,
        volume_discount_rules: Array.isArray(data.volume_discount_rules) 
          ? (data.volume_discount_rules as unknown as DiscountTier[])
          : [],
        delivery_regions: Array.isArray(data.delivery_regions) 
          ? (data.delivery_regions as unknown as string[])
          : ['Nacional']
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

  const processCsvProducts = async (csvContent: string) => {
    const lines = csvContent.split('\n').filter(line => line.trim())
    if (lines.length < 2) throw new Error('Arquivo CSV deve conter cabeçalho e pelo menos um produto')

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const requiredHeaders = ['sku', 'nome produto', 'preço de custo', 'preço de venda', 'margem de lucro', 'categoria do produto']
    
    const missingHeaders = requiredHeaders.filter(required => 
      !headers.some(header => header.includes(required.toLowerCase()))
    )
    
    if (missingHeaders.length > 0) {
      throw new Error(`Colunas obrigatórias não encontradas: ${missingHeaders.join(', ')}`)
    }

    // Clear existing products
    await supabase
      .from('products')
      .delete()
      .eq('distributor_id', user.id)

    const products = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      if (values.length < headers.length) continue

      const product = {
        distributor_id: user.id,
        sku: values[headers.findIndex(h => h.includes('sku'))] || '',
        product_name: values[headers.findIndex(h => h.includes('nome'))] || '',
        cost_price: parseFloat(values[headers.findIndex(h => h.includes('custo'))] || '0'),
        selling_price: parseFloat(values[headers.findIndex(h => h.includes('venda'))] || '0'),
        profit_margin: parseFloat(values[headers.findIndex(h => h.includes('margem'))] || '0'),
        category: values[headers.findIndex(h => h.includes('categoria'))] || '',
        description: values[headers.findIndex(h => h.includes('descrição')) || headers.findIndex(h => h.includes('descricao'))] || '',
        technical_specs: values[headers.findIndex(h => h.includes('ficha') || h.includes('técnica'))] || ''
      }

      if (product.sku && product.product_name) {
        products.push(product)
      }
    }

    if (products.length === 0) {
      throw new Error('Nenhum produto válido encontrado no arquivo')
    }

    const { error: insertError } = await supabase
      .from('products')
      .insert(products)

    if (insertError) throw insertError

    return products.length
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

      // Process CSV files to extract products
      let productsProcessed = 0
      if (file.name.toLowerCase().endsWith('.csv')) {
        const fileContent = await file.text()
        productsProcessed = await processCsvProducts(fileContent)
      }

      setConfig(prev => ({
        ...prev,
        catalog_file_url: urlData.publicUrl,
        catalog_file_name: file.name,
        catalog_uploaded_at: new Date().toISOString()
      }))

      toast({
        title: "Catálogo enviado",
        description: file.name.toLowerCase().endsWith('.csv') 
          ? `Arquivo carregado e ${productsProcessed} produtos processados com sucesso!`
          : "Arquivo carregado com sucesso!"
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

  const downloadTemplate = () => {
    const csvContent = "SKU,Nome Produto,Preço de Custo,Preço de Venda,Margem de Lucro,Categoria do Produto,Descrição,Ficha Técnica\n" +
      "EX001,Parafuso M8x20,0.50,1.20,140,Fixação,Parafuso de aço carbono,Resistência: 8.8\n" +
      "EX002,Porca M8,0.30,0.80,166,Fixação,Porca sextavada,Material: Aço zincado"
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template-catalogo.csv'
    a.click()
    window.URL.revokeObjectURL(url)
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

            {config.volume_discount_enabled && (
              <div className="space-y-4">
                <Separator />
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Faixas de Desconto</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (config.volume_discount_rules.length < 3) {
                        setConfig(prev => ({
                          ...prev,
                          volume_discount_rules: [
                            ...prev.volume_discount_rules,
                            { min_value: 0, discount_percentage: 0 }
                          ]
                        }))
                      }
                    }}
                    disabled={config.volume_discount_rules.length >= 3}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Faixa
                  </Button>
                </div>
                
                {config.volume_discount_rules.map((tier, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <div className="flex-1">
                      <Label className="text-sm">Valor mínimo (R$)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={tier.min_value}
                        onChange={(e) => {
                          const newTiers = [...config.volume_discount_rules]
                          newTiers[index].min_value = parseFloat(e.target.value) || 0
                          setConfig(prev => ({ ...prev, volume_discount_rules: newTiers }))
                        }}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm">Desconto (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={tier.discount_percentage}
                        onChange={(e) => {
                          const newTiers = [...config.volume_discount_rules]
                          newTiers[index].discount_percentage = parseFloat(e.target.value) || 0
                          setConfig(prev => ({ ...prev, volume_discount_rules: newTiers }))
                        }}
                        placeholder="0.00"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newTiers = config.volume_discount_rules.filter((_, i) => i !== index)
                        setConfig(prev => ({ ...prev, volume_discount_rules: newTiers }))
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {config.volume_discount_rules.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    <p>Nenhuma faixa de desconto configurada</p>
                    <p className="text-sm">Clique em "Adicionar Faixa" para começar</p>
                  </div>
                )}
              </div>
            )}
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
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="catalog_upload">Novo Catálogo</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={downloadTemplate}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Baixar Template CSV
                </Button>
              </div>
              <Input
                id="catalog_upload"
                type="file"
                accept=".pdf,.xlsx,.xls,.csv"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-muted-foreground mt-1">Enviando arquivo...</p>}
              <p className="text-xs text-muted-foreground">
                Para arquivos CSV, use o template acima com as colunas: SKU, Nome Produto, Preço de Custo, Preço de Venda, Margem de Lucro, Categoria do Produto, Descrição, Ficha Técnica
              </p>
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