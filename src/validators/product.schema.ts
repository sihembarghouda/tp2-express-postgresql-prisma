import { z } from "zod";

export const productSchema = z.object({
  title: z.string().trim().min(1, "Le titre est obligatoire"),
  description: z.string().optional().default(""),
  price: z.number().finite().min(0, "Le prix doit être positif ou nul"),
  image: z.string().optional().default(""),
  categoryId: z.number().int().positive("La catégorie est obligatoire"),
});

export type ProductInput = z.infer<typeof productSchema>;
