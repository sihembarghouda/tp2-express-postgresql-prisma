import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Le nom de la catégorie est obligatoire"),
});

export type CategoryInput = z.infer<typeof categorySchema>;
