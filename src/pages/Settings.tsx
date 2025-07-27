import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings2, Bot, Percent, DollarSign, Globe, Plus, Trash2, Code } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DiscountTier {
  min_value: number
  discount_percentage: number
}

interface DistributorConfig {
  id?: string
  default_discount_percentage: number
  max_discount_percentage: number
  volume_discount_enabled: boolean
  volume_discount_rules: DiscountTier[]
  minimum_order_value: number
  payment_terms: string
  delivery_regions: string[]
}

export default function Settings() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState<DistributorConfig>({
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
          default_discount_percentage: data.default_discount_percentage || 0,
          max_discount_percentage: data.max_discount_percentage || 15,
          volume_discount_enabled: data.volume_discount_enabled ?? true,
          volume_discount_rules: Array.isArray(data.volume_discount_rules) 
            ? (data.volume_discount_rules as unknown as DiscountTier[])
            : [],
          minimum_order_value: data.minimum_order_value || 0,
          payment_terms: data.payment_terms || 'À vista, 30/60/90 dias',
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
        default_discount_percentage: data.default_discount_percentage || 0,
        max_discount_percentage: data.max_discount_percentage || 15,
        volume_discount_enabled: data.volume_discount_enabled ?? true,
        volume_discount_rules: Array.isArray(data.volume_discount_rules) 
          ? (data.volume_discount_rules as unknown as DiscountTier[])
          : [],
        minimum_order_value: data.minimum_order_value || 0,
        payment_terms: data.payment_terms || 'À vista, 30/60/90 dias',
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
        {/* Widget Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-primary" />
              <span>Configuração do Widget</span>
            </CardTitle>
            <CardDescription>
              Configure o widget de chat para seu site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Código do Widget</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Copie e cole este código em seu site onde deseja que o chat apareça:
              </p>
              <div className="bg-background p-3 rounded border font-mono text-sm">
                {`<script src="[URL_DO_SEU_SITE]/widget.js"></script>`}
              </div>
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