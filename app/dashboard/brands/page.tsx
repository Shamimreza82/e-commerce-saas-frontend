"use client";

import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from "@/modules/brand/brand.hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Tag, Save, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function BrandsPage() {
  const { data: brandsData, isLoading } = useBrands();
  const { mutate: createBrand, isPending: isCreating } = useCreateBrand();
  const { mutate: updateBrand, isPending: isUpdating } = useUpdateBrand();
  const { mutate: deleteBrand } = useDeleteBrand();

  const [editingId, setEditingId] = useState<string | null>(null);
  const brands = brandsData?.data || [];

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    if (editingId) {
      updateBrand({ id: editingId, data }, {
        onSuccess: () => {
          setEditingId(null);
          reset();
        }
      });
    } else {
      createBrand(data, {
        onSuccess: () => reset()
      });
    }
  };

  const handleEdit = (brand: any) => {
    setEditingId(brand.id);
    setValue("name", brand.name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string, name: string) => {
    toast(`Delete brand "${name}"?`, {
      description: "Products linked to this brand will have their brand removed.",
      action: {
        label: "Delete",
        onClick: () => deleteBrand(id),
      },
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight">Brands</h1>
        <p className="text-zinc-500 text-lg">Manage the product brands you carry.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Card */}
        <div className="lg:col-span-1">
          <Card className="border-none shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-800 sticky top-28">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{editingId ? "Edit Brand" : "Create Brand"}</CardTitle>
              <CardDescription>Enter the name of the brand.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold uppercase text-[10px] tracking-widest text-zinc-400">Brand Name</Label>
                  <Input 
                    id="name" 
                    {...register("name", { required: "Name is required" })} 
                    placeholder="e.g. Apple, Nike" 
                    className="h-12 rounded-xl"
                  />
                  {errors.name && <p className="text-xs font-medium text-red-500">{errors.name.message as string}</p>}
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 h-12 rounded-xl font-bold" disabled={isCreating || isUpdating}>
                    {editingId ? <><Save className="mr-2 h-4 w-4" /> Update</> : <><Tag className="mr-2 h-4 w-4" /> Create</>}
                  </Button>
                  {editingId && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="h-12 w-12 rounded-xl p-0" 
                      onClick={() => { setEditingId(null); reset(); }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List Card */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
            <CardHeader className="border-b">
              <CardTitle className="text-xl font-bold">All Brands</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-6">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-zinc-50 animate-pulse rounded-2xl dark:bg-zinc-900" />)}
                </div>
              ) : brands.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900 mb-4">
                    <Tag className="h-8 w-8 text-zinc-300" />
                  </div>
                  <p className="text-zinc-500 font-medium">No brands found yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {brands.map((brand: any) => (
                    <div key={brand.id} className="flex items-center justify-between p-6 hover:bg-zinc-50/50 transition-colors group dark:hover:bg-zinc-900/30">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 transition-transform group-hover:scale-110">
                          <Tag className="h-5 w-5 text-zinc-500" />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-zinc-950 dark:text-zinc-50">{brand.name}</p>
                          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">{brand._count?.products || 0} Products</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:bg-white shadow-sm ring-1 ring-transparent hover:ring-zinc-200 transition-all dark:hover:bg-zinc-800 dark:hover:ring-zinc-700" 
                          onClick={() => handleEdit(brand)}
                        >
                          <Edit className="h-4 w-4 text-zinc-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-all dark:hover:bg-red-950/20"
                          onClick={() => handleDelete(brand.id, brand.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
