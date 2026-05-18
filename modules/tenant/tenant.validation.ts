import { z } from "zod";

export const updateStoreSchema = z.object({
  name: z.string().min(3, "Store name must be at least 3 characters").max(50),
  description: z.string().max(500).optional(),
  logoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  bannerUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().max(20).optional().or(z.literal("")),
  address: z.string().max(200).optional().or(z.literal("")),
  currency: z.string().length(3).default("BDT"),
  timezone: z.string().default("Asia/Dhaka"),
});

export type TUpdateStore = z.infer<typeof updateStoreSchema>;
