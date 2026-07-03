import api from './axios'

/* ─── Auth ───────────────────────────────────────────────────────────────── */
export const registerUser = (data: { name: string; email: string; password: string }) =>
  api.post('/auth/register', data)

export const loginUser = (data: { email: string; password: string }) =>
  api.post('/auth/login', data)

/* ─── Blogs ──────────────────────────────────────────────────────────────── */
export const fetchBlogs = (params: { query?: string; page?: number; limit?: number }) =>
  api.get('/blogs', { params })

export const fetchBlogBySlug = (slug: string) =>
  api.get(`/blogs/${slug}`)

export const createBlog = (data: {
  title: string
  content: string
  excerpt?: string
  coverImage?: string
  tags?: string[]
}) => api.post('/blogs', data)

export const updateBlog = (
  slug: string,
  data: { title?: string; content?: string; excerpt?: string; coverImage?: string; tags?: string[] }
) => api.put(`/blogs/${slug}`, data)

export const deleteBlog = (slug: string) => api.delete(`/blogs/${slug}`)
