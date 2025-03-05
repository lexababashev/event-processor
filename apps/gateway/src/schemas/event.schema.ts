import { z } from 'zod';

export const funnelStageSchema = z.enum(['top', 'bottom']);

export const facebookUserSchema = z.object({
  userId: z.string(),
  name: z.string(),
  age: z.number().int().nonnegative(),
  gender: z.enum(['male', 'female', 'non-binary']),
  location: z.object({
    country: z.string(),
    city: z.string(),
  }),
});

export const facebookEngagementTopSchema = z.object({
  actionTime: z.string(),
  referrer: z.enum(['newsfeed', 'marketplace', 'groups']),
  videoId: z.string().nullable(),
});

export const facebookEngagementBottomSchema = z.object({
  adId: z.string(),
  campaignId: z.string(),
  clickPosition: z.enum(['top_left', 'bottom_right', 'center']),
  device: z.enum(['mobile', 'desktop']),
  browser: z.enum(['Chrome', 'Firefox', 'Safari']),
  purchaseAmount: z.string().nullable(),
});

export const facebookEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal('facebook'),
  funnelStage: funnelStageSchema,
  eventType: z.union([
    z.enum(['ad.view', 'page.like', 'comment', 'video.view']),
    z.enum(['ad.click', 'form.submission', 'checkout.complete']),
  ]),
  data: z.object({
    user: facebookUserSchema,
    engagement: z.union([facebookEngagementTopSchema, facebookEngagementBottomSchema]),
  }),
});

export const tiktokUserSchema = z.object({
  userId: z.string(),
  username: z.string(),
  followers: z.number().int().nonnegative(),
});

export const tiktokEngagementTopSchema = z.object({
  watchTime: z.number().nonnegative(),
  percentageWatched: z.number().min(0).max(100),
  device: z.enum(['Android', 'iOS', 'Desktop']),
  country: z.string(),
  videoId: z.string(),
});

export const tiktokEngagementBottomSchema = z.object({
  actionTime: z.string(),
  profileId: z.string().nullable(),
  purchasedItem: z.string().nullable(),
  purchaseAmount: z.string().nullable(),
});

export const tiktokEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal('tiktok'),
  funnelStage: funnelStageSchema,
  eventType: z.union([
    z.enum(['video.view', 'like', 'share', 'comment']),
    z.enum(['profile.visit', 'purchase', 'follow']),
  ]),
  data: z.object({
    user: tiktokUserSchema,
    engagement: z.union([tiktokEngagementTopSchema, tiktokEngagementBottomSchema]),
  }),
});

export const eventSchema = z.union([facebookEventSchema, tiktokEventSchema]);