import { z } from "zod";

export const createProductSchema = z.object({
  // 1. Product (Parent)
  name: z.string().min(3, "Product name must be at least 3 characters").max(100),
  description: z.string().max(2000).optional().or(z.literal("")),
  type: z.enum(["PHYSICAL", "DIGITAL", "SERVICE", "SUBSCRIPTION"]).default("PHYSICAL"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "OUT_OF_STOCK"]).default("DRAFT"),
  categoryId: z.string().optional().or(z.literal("")),
  brandId: z.string().optional().or(z.literal("")),
  taxCode: z.string().optional().or(z.literal("")),
  searchKeywords: z.string().optional().or(z.literal("")), // Will be split by comma

  // 2. Default Variant Info
  sku: z.string().min(3, "SKU must be at least 3 characters").max(50),
  barcode: z.string().optional().or(z.literal("")),
  price: z.coerce.number().positive("Price must be positive"),
  compareAtPrice: z.coerce.number().positive().optional().or(z.literal("")).transform(v => v === "" ? undefined : v),
  costPerItem: z.coerce.number().positive().optional().or(z.literal("")).transform(v => v === "" ? undefined : v),
  
  // Logistics
  weight: z.coerce.number().positive().optional().or(z.literal("")).transform(v => v === "" ? undefined : v),
  length: z.coerce.number().positive().optional().or(z.literal("")).transform(v => v === "" ? undefined : v),
  width: z.coerce.number().positive().optional().or(z.literal("")).transform(v => v === "" ? undefined : v),
  height: z.coerce.number().positive().optional().or(z.literal("")).transform(v => v === "" ? undefined : v),
  fulfillmentType: z.enum(["SELLER_FULFILLED", "PLATFORM_FULFILLED"]).default("SELLER_FULFILLED"),

  // 3. Inventory
  quantity: z.coerce.number().int().nonnegative("Quantity cannot be negative").default(0),
  warehouseId: z.string().optional().or(z.literal("")),

  // 4. Media
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export type TCreateProduct = z.infer<typeof createProductSchema>;
