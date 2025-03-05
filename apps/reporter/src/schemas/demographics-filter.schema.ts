import { z } from 'zod';

export const DemographicsFilterSchema = z.object({
  from: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: 'Invalid date format for "from"' }),
  to: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: 'Invalid date format for "to"' }),
  source: z
    .string()
    .optional()
    .refine((val) => !val || val === 'facebook' || val === 'tiktok', { message: 'Invalid source. Must be "facebook" or "tiktok"' }),
});
