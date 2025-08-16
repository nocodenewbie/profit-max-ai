import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Package, Edit3, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Product {
  id: string
  sku: string
  product_name: string
  category: string
  description: string
  technical_specs: string
  cost_price: number
  selling_price: number
  profit_margin: number
}

export default function Products() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    sku: "",
    product_name: "",
    category: "",
    description: "",
    technical_specs: "",
    cost_price: 0,
    selling_price: 0
  })

  useEffect(() => {
    if (user) {
      loadProducts()
    }
  }, [user])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('distributor_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error: any) {
      toast({
        title: "Erro ao carregar produtos",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateProfitMargin = (cost: number, selling: number) => {
    if (cost === 0) return 0
    return ((selling - cost) / cost) * 100
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.sku || !formData.product_name || !formData.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha SKU, nome e categoria",
        variant: "destructive"
      })
      return
    }

    try {
      const profitMargin = calculateProfitMargin(formData.cost_price, formData.selling_price)
      
      const productData = {
        ...formData,
        distributor_id: user?.id,
        profit_margin: profitMargin
      }

      let result
      if (editingProduct) {
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
      } else {
        result = await supabase
          .from('products')
          .insert([productData])
      }

      if (result.error) throw result.error

      toast({
        title: editingProduct ? "Produto atualizado" : "Produto criado",
        description: "Operação realizada com sucesso!"
      })

      setDialogOpen(false)
      resetForm()
      loadProducts()
    } catch (error: any) {
      toast({
        title: "Erro ao salvar produto",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      sku: product.sku,
      product_name: product.product_name,
      category: product.category,
      description: product.description || "",
      technical_specs: product.technical_specs || "",
      cost_price: product.cost_price,
      selling_price: product.selling_price
    })
    setDialogOpen(true)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      toast({
        title: "Produto excluído",
        description: "Produto removido com sucesso!"
      })
      loadProducts()
    } catch (error: any) {
      toast({
        title: "Erro ao excluir produto",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      sku: "",
      product_name: "",
      category: "",
      description: "",
      technical_specs: "",
      cost_price: 0,
      selling_price: 0
    })
  }

  if (loading) {
    return (
      <DashboardLayout title="Produtos">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-48 bg-muted rounded-lg"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Produtos">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Catálogo de Produtos</h2>
            <p className="text-muted-foreground">Gerencie seus produtos para a IA</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </DialogTitle>
                <DialogDescription>
                  Adicione as informações do produto para que a IA possa oferecê-lo aos clientes
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                      placeholder="ABC123"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Ferramentas"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="product_name">Nome do Produto *</Label>
                  <Input
                    id="product_name"
                    value={formData.product_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
                    placeholder="Parafuso Allen M8 x 50mm"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição do produto..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="technical_specs">Especificações Técnicas</Label>
                  <Textarea
                    id="technical_specs"
                    value={formData.technical_specs}
                    onChange={(e) => setFormData(prev => ({ ...prev, technical_specs: e.target.value }))}
                    placeholder="Material: Aço inox, Rosca: M8, Comprimento: 50mm..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cost_price">Preço de Custo (R$)</Label>
                    <Input
                      id="cost_price"
                      type="number"
                      step="0.01"
                      value={formData.cost_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost_price: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="selling_price">Preço de Venda (R$)</Label>
                    <Input
                      id="selling_price"
                      type="number"
                      step="0.01"
                      value={formData.selling_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, selling_price: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                
                {formData.cost_price > 0 && formData.selling_price > 0 && (
                  <div className="p-3 bg-muted rounded">
                    <p className="text-sm">
                      Margem de Lucro: <span className="font-bold">
                        {calculateProfitMargin(formData.cost_price, formData.selling_price).toFixed(1)}%
                      </span>
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingProduct ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum produto cadastrado</h3>
              <p className="text-muted-foreground text-center mb-4">
                Adicione produtos para que a IA possa oferecê-los aos seus clientes
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Produto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.product_name}</CardTitle>
                      <CardDescription>SKU: {product.sku}</CardDescription>
                    </div>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Custo:</span>
                        <div className="font-medium">R$ {product.cost_price.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Venda:</span>
                        <div className="font-medium">R$ {product.selling_price.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Margem:</span>
                        <span className="font-medium ml-1">{product.profit_margin.toFixed(1)}%</span>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}