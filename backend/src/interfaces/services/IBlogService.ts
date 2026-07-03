import { IBlog } from '../../models/Blog';

export interface IBlogService {
  createBlog(data: Partial<IBlog>, userId: string): Promise<IBlog>;
  getBlogs(query: string, page: number, limit: number): Promise<{ blogs: IBlog[]; total: number }>;
  getBlogBySlug(slug: string): Promise<IBlog>;
  updateBlog(slug: string, data: Partial<IBlog>, userId: string): Promise<IBlog>;
  deleteBlog(slug: string, userId: string): Promise<boolean>;
}
