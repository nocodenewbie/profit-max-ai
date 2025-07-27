import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Download, Package } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ProductStats } from "@/components/settings/ProductStats"
import { ProductsTable } from "@/components/settings/ProductsTable"

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

export default function Products() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [lastImportDate, setLastImportDate] = useState<string>()

  useEffect(() => {
    loadProducts()
    loadConfig()
  }, [user])

  const loadProducts = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('distributor_id', user.id)
        .order('product_name')

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

  const loadConfig = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('distributor_configs')
        .select('catalog_uploaded_at')
        .eq('distributor_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data?.catalog_uploaded_at) {
        setLastImportDate(data.catalog_uploaded_at)
      }
    } catch (error: any) {
      console.error('Error loading config:', error)
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

      // Update config with upload info
      await supabase
        .from('distributor_configs')
        .upsert({
          distributor_id: user.id,
          catalog_file_url: urlData.publicUrl,
          catalog_file_name: file.name,
          catalog_uploaded_at: new Date().toISOString()
        })

      toast({
        title: "Catálogo enviado",
        description: file.name.toLowerCase().endsWith('.csv') 
          ? `Arquivo carregado e ${productsProcessed} produtos processados com sucesso!`
          : "Arquivo carregado com sucesso!"
      })

      // Reload data
      if (file.name.toLowerCase().endsWith('.csv')) {
        loadProducts()
        loadConfig()
      }
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
      <DashboardLayout title="Produtos">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="h-24 bg-muted rounded-lg"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
          </div>
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Produtos">
      <div className="space-y-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-primary" />
              <span>Upload do Catálogo</span>
            </CardTitle>
            <CardDescription>
              Faça upload do seu catálogo de produtos em formato CSV
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="catalog_file">Arquivo do Catálogo</Label>
                <Input
                  id="catalog_file"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </div>
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="self-end"
              >
                <Download className="h-4 w-4 mr-2" />
                Template CSV
              </Button>
            </div>
            {uploading && (
              <div className="text-sm text-muted-foreground">
                Processando arquivo... Isso pode levar alguns minutos.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Statistics */}
        <ProductStats products={products} lastImportDate={lastImportDate} />

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-primary" />
              <span>Produtos Cadastrados</span>
            </CardTitle>
            <CardDescription>
              Gerencie seus produtos, preços e informações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductsTable products={products} onProductUpdated={loadProducts} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}