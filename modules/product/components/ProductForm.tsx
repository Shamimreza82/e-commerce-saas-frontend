"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, TCreateProduct } from "../product.validation";
import { useCreateProduct, useUpdateProduct } from "../product.hooks";
import { useCategories } from "@/modules/category/category.hooks";
import { useBrands } from "@/modules/brand/brand.hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Input,
} from "@/components/ui/input";
import {
  Label,
} from "@/components/ui/label";
import {
  Textarea,
} from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Image as ImageIcon,
  DollarSign,
  Truck,
  Info,
  Save,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProductFormProps {
  productId?: string;
  initialData?: any;
}

export const ProductForm = ({ productId, initialData }: ProductFormProps) => {
  const router = useRouter();
  const isEditMode = !!productId;
  
  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TCreateProduct>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      type: "PHYSICAL",
      status: "DRAFT",
      fulfillmentType: "SELLER_FULFILLED",
      quantity: 0,
      categoryId: "",
      brandId: "",
    },
  });

  // Populate form in edit mode
  useEffect(() => {
    if (initialData) {
      const variant = initialData.variants?.[0];
      reset({
        name: initialData.name,
        description: initialData.description || "",
        type: initialData.type,
        status: initialData.status,
        categoryId: initialData.categoryId || "",
        brandId: initialData.brandId || "",
        taxCode: initialData.taxCode || "",
        searchKeywords: initialData.searchKeywords?.join(", ") || "",
        sku: variant?.sku || "",
        barcode: variant?.barcode || "",
        price: Number(variant?.price) || 0,
        compareAtPrice: variant?.compareAtPrice ? Number(variant.compareAtPrice) : undefined,
        costPerItem: variant?.costPerItem ? Number(variant.costPerItem) : undefined,
        weight: variant?.weight ? Number(variant.weight) : undefined,
        length: variant?.length ? Number(variant.length) : undefined,
        width: variant?.width ? Number(variant.width) : undefined,
        height: variant?.height ? Number(variant.height) : undefined,
        fulfillmentType: variant?.fulfillmentType || "SELLER_FULFILLED",
        quantity: variant?.inventoryLevels?.[0]?.quantity || 0,
        imageUrl: initialData.images?.[0]?.url || "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: TCreateProduct) => {
    console.log("Form submitted. Data:", data);
    console.log("Is Edit Mode:", isEditMode, "Product ID:", productId);
    
    if (isEditMode) {
      updateProduct({ id: productId as string, data });
    } else {
      createProduct(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 pb-24">
      <Tabs defaultValue="general" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto h-auto p-1 bg-zinc-100 dark:bg-zinc-800">
            <TabsTrigger value="general" className="gap-2 py-2.5">
              <Info className="h-4 w-4" /> General
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2 py-2.5">
              <DollarSign className="h-4 w-4" /> Pricing
            </TabsTrigger>
            <TabsTrigger value="shipping" className="gap-2 py-2.5">
              <Truck className="h-4 w-4" /> Shipping
            </TabsTrigger>
            <TabsTrigger value="media" className="gap-2 py-2.5">
              <ImageIcon className="h-4 w-4" /> Media
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              className="gap-2"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2 px-8">
              {isPending ? (isEditMode ? "Updating..." : "Creating...") : <><Save className="h-4 w-4" /> {isEditMode ? "Update Product" : "Save Product"}</>}
            </Button>
          </div>
        </div>

        {/* --- GENERAL TAB --- */}
        <TabsContent value="general" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>Enter the essential information for this product listing.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g. Premium Cotton T-Shirt" 
                      {...register("name")}
                    />
                    {errors.name && <p className="text-xs font-medium text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Write a compelling description..." 
                      className="min-h-[150px]"
                      {...register("description")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="searchKeywords">Search Keywords (Comma separated)</Label>
                    <Input 
                      id="searchKeywords" 
                      placeholder="shirt, cotton, summer, clothing" 
                      {...register("searchKeywords")}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
                <CardHeader>
                  <CardTitle>Status & Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Product Status</Label>
                    <Select 
                      onValueChange={(v) => setValue("status", v as any)} 
                      value={watch("status")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select 
                      onValueChange={(v) => setValue("categoryId", v)} 
                      value={watch("categoryId")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Uncategorized" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Uncategorized</SelectItem>
                        {categoriesData?.data?.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Brand</Label>
                    <Select 
                      onValueChange={(v) => setValue("brandId", v)} 
                      value={watch("brandId")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="No Brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Brand</SelectItem>
                        {brandsData?.data?.map((brand: any) => (
                          <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Type</Label>
                    <Select 
                      onValueChange={(v) => setValue("type", v as any)} 
                      value={watch("type")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PHYSICAL">Physical</SelectItem>
                        <SelectItem value="DIGITAL">Digital</SelectItem>
                        <SelectItem value="SERVICE">Service</SelectItem>
                        <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxCode">Tax Code (Optional)</Label>
                    <Input id="taxCode" placeholder="VAT-2024" {...register("taxCode")} />
                  </div>
                </CardContent>
              </Card>
          </div>
        </TabsContent>

        {/* --- PRICING & INVENTORY TAB --- */}
        <TabsContent value="pricing" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Configure your product&apos;s price and margins.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Sale Price (৳)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">৳</span>
                    <Input id="price" type="number" step="0.01" className="pl-8" {...register("price")} />
                  </div>
                  {errors.price && <p className="text-xs font-medium text-red-500">{errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compareAtPrice">Compare at Price (৳)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300 font-bold">৳</span>
                    <Input id="compareAtPrice" type="number" step="0.01" className="pl-8" {...register("compareAtPrice")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPerItem">Cost per item (৳)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300 font-bold">৳</span>
                    <Input id="costPerItem" type="number" step="0.01" className="pl-8" {...register("costPerItem")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>Track stock levels and set identifiers.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="TSHIRT-001" {...register("sku")} />
                  {errors.sku && <p className="text-xs font-medium text-red-500">{errors.sku.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode (ISBN, UPC, GTIN)</Label>
                  <Input id="barcode" placeholder="123456789" {...register("barcode")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity in Stock</Label>
                  <Input id="quantity" type="number" {...register("quantity")} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- SHIPPING TAB --- */}
        <TabsContent value="shipping" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Logistics & Shipping</CardTitle>
              <CardDescription>Set physical dimensions for shipping calculation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" step="0.001" placeholder="0.5" {...register("weight")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input id="length" type="number" placeholder="10" {...register("length")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input id="width" type="number" placeholder="10" {...register("width")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" placeholder="10" {...register("height")} />
                </div>
              </div>
              <div className="space-y-2 max-w-md">
                <Label>Fulfillment Type</Label>
                <Select 
                  onValueChange={(v) => setValue("fulfillmentType", v as any)} 
                  value={watch("fulfillmentType")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SELLER_FULFILLED">Seller Fulfilled (FBM)</SelectItem>
                    <SelectItem value="PLATFORM_FULFILLED">Platform Fulfilled (FBA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- MEDIA TAB --- */}
        <TabsContent value="media" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Product Media</CardTitle>
              <CardDescription>Add images to showcase your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Featured Image URL</Label>
                <div className="flex gap-4">
                  <Input 
                    id="imageUrl" 
                    placeholder="https://images.unsplash.com/..." 
                    {...register("imageUrl")}
                  />
                  <Button type="button" variant="secondary">Add</Button>
                </div>
                {errors.imageUrl && <p className="text-xs font-medium text-red-500">{errors.imageUrl.message}</p>}
              </div>
              
              <div className="aspect-video w-full rounded-2xl bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                {watch("imageUrl") ? (
                  <div className="relative h-full w-full p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={watch("imageUrl")} 
                      alt="Preview" 
                      className="h-full w-full object-contain rounded-xl"
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-6 right-6 rounded-full shadow-lg"
                      onClick={() => setValue("imageUrl", "")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="rounded-full bg-white p-4 shadow-sm dark:bg-zinc-900 mb-4">
                      <ImageIcon className="h-8 w-8 text-zinc-400" />
                    </div>
                    <p className="text-sm font-medium text-zinc-500">Preview will appear here</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t z-50 dark:bg-black/80 lg:pl-64">
        <div className="container mx-auto max-w-7xl flex items-center justify-between px-8">
          <div className="hidden sm:block">
            <h4 className="font-bold text-sm">{isEditMode ? "Editing Product" : "New Product Listing"}</h4>
            <p className="text-xs text-zinc-500">Unsaved changes will be lost if you leave.</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button type="submit" disabled={isPending} className="h-12 px-12 text-base font-bold w-full sm:w-auto">
              {isPending ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Product" : "Launch Product")}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
