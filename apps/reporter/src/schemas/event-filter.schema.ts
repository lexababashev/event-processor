import { z } from 'zod';

export const EventFilterSchema = z.object({
  from: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: 'Invalid date format for "from"',
  }),
  to: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: 'Invalid date format for "to"',
  }),
  source: z.string().optional().refine((val) => !val || val === 'facebook' || val === 'tiktok', { message: 'Invalid source. Must be "facebook" or "tiktok"' }),
  funnelStage: z.string().optional().refine((val) => !val || val === 'bottom' || val === 'top', { message: 'Invalid funnelStage. Must be "bottom" or "top"' }),
  eventType: z.string().optional(),
});

export type EventFilter = z.infer<typeof EventFilterSchema>;
