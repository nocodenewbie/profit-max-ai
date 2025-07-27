import { useState } from "react"
import { Search, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

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

interface ProductsTableProps {
  products: Product[]
  onProductUpdated: () => void
}

export function ProductsTable({ products, onProductUpdated }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showSpecs, setShowSpecs] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const filteredProducts = products.filter(product => 
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (productId: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return

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
      onProductUpdated()
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleSaveEdit = async () => {
    if (!editingProduct) return

    try {
      const { error } = await supabase
        .from('products')
        .update({
          sku: editingProduct.sku,
          product_name: editingProduct.product_name,
          cost_price: editingProduct.cost_price,
          selling_price: editingProduct.selling_price,
          profit_margin: editingProduct.profit_margin,
          category: editingProduct.category,
          description: editingProduct.description || null,
          technical_specs: editingProduct.technical_specs || null
        })
        .eq('id', editingProduct.id)

      if (error) throw error

      toast({
        title: "Produto atualizado",
        description: "Produto salvo com sucesso!"
      })
      setEditingProduct(null)
      onProductUpdated()
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const toggleSpecs = (productId: string) => {
    setShowSpecs(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por SKU, nome ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">
          {filteredProducts.length} produtos
        </Badge>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Preço Custo</TableHead>
              <TableHead className="text-right">Preço Venda</TableHead>
              <TableHead className="text-right">Margem %</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{product.product_name}</p>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {product.description}
                      </p>
                    )}
                    {product.technical_specs && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSpecs(product.id)}
                        className="h-auto p-0 text-xs text-primary"
                      >
                        {showSpecs[product.id] ? (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Ocultar especificações
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Ver especificações
                          </>
                        )}
                      </Button>
                    )}
                    {showSpecs[product.id] && product.technical_specs && (
                      <div className="mt-2 p-2 bg-muted rounded text-xs">
                        {product.technical_specs}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  R$ {product.cost_price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  R$ {product.selling_price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge 
                    variant={product.profit_margin >= 50 ? "default" : product.profit_margin >= 20 ? "secondary" : "destructive"}
                  >
                    {product.profit_margin.toFixed(1)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                          <DialogTitle>Editar Produto</DialogTitle>
                          <DialogDescription>
                            Faça alterações nos dados do produto
                          </DialogDescription>
                        </DialogHeader>
                        {editingProduct && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="edit-sku">SKU</Label>
                                <Input
                                  id="edit-sku"
                                  value={editingProduct.sku}
                                  onChange={(e) => setEditingProduct({
                                    ...editingProduct,
                                    sku: e.target.value
                                  })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-category">Categoria</Label>
                                <Input
                                  id="edit-category"
                                  value={editingProduct.category}
                                  onChange={(e) => setEditingProduct({
                                    ...editingProduct,
                                    category: e.target.value
                                  })}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="edit-name">Nome do Produto</Label>
                              <Input
                                id="edit-name"
                                value={editingProduct.product_name}
                                onChange={(e) => setEditingProduct({
                                  ...editingProduct,
                                  product_name: e.target.value
                                })}
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor="edit-cost">Preço Custo</Label>
                                <Input
                                  id="edit-cost"
                                  type="number"
                                  step="0.01"
                                  value={editingProduct.cost_price}
                                  onChange={(e) => setEditingProduct({
                                    ...editingProduct,
                                    cost_price: parseFloat(e.target.value) || 0
                                  })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-selling">Preço Venda</Label>
                                <Input
                                  id="edit-selling"
                                  type="number"
                                  step="0.01"
                                  value={editingProduct.selling_price}
                                  onChange={(e) => setEditingProduct({
                                    ...editingProduct,
                                    selling_price: parseFloat(e.target.value) || 0
                                  })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-margin">Margem %</Label>
                                <Input
                                  id="edit-margin"
                                  type="number"
                                  step="0.01"
                                  value={editingProduct.profit_margin}
                                  onChange={(e) => setEditingProduct({
                                    ...editingProduct,
                                    profit_margin: parseFloat(e.target.value) || 0
                                  })}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="edit-description">Descrição</Label>
                              <Textarea
                                id="edit-description"
                                value={editingProduct.description || ''}
                                onChange={(e) => setEditingProduct({
                                  ...editingProduct,
                                  description: e.target.value
                                })}
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-specs">Especificações Técnicas</Label>
                              <Textarea
                                id="edit-specs"
                                value={editingProduct.technical_specs || ''}
                                onChange={(e) => setEditingProduct({
                                  ...editingProduct,
                                  technical_specs: e.target.value
                                })}
                                rows={3}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setEditingProduct(null)}>
                                Cancelar
                              </Button>
                              <Button onClick={handleSaveEdit}>
                                Salvar
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
          </div>
        )}
      </div>
    </div>
  )
}