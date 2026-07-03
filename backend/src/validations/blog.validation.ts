import { z } from 'zod';

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    content: z.string(),
    excerpt: z.string().optional(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateBlogSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    content: z.string().optional(),
    excerpt: z.string().optional(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});
