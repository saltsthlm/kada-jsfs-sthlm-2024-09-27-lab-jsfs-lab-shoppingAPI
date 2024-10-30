/*
 * You may use this validator to enforce data integrity in your API.
 */

import { z } from "zod";

export type ItemSchema = z.infer<typeof itemSchema>;

const itemSchema = z.object({
  id: z.string(),
  item: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export const validate = (obj: ItemSchema) => itemSchema.safeParse(obj); 
