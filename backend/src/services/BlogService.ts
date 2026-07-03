import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { AppError } from '../utils/AppError';
import { IBlog } from '../models/Blog';
import { IBlogService } from '../interfaces/services/IBlogService';
import { IBlogRepository } from '../interfaces/IBlogRepository';
import TYPES from '../container/types';

@injectable()
export class BlogService implements IBlogService {
  constructor(
    @inject(TYPES.IBlogRepository) private blogRepository: IBlogRepository
  ) {}

  private generateSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  async createBlog(data: Partial<IBlog>, userId: string): Promise<IBlog> {
    if (!data.title || !data.content) {
      throw new AppError('Title and content are required', 400);
    }

    let slug = this.generateSlug(data.title);
    const existing = await this.blogRepository.findBySlug(slug);
    if (existing) slug = `${slug}-${Date.now()}`;

    return await this.blogRepository.create({ ...data, slug, author: userId as any });
  }

  async getBlogs(query = '', page = 1, limit = 10) {
    return await this.blogRepository.search(query, page, limit);
  }

  async getBlogBySlug(slug: string): Promise<IBlog> {
    const blog = await this.blogRepository.findBySlug(slug);
    if (!blog) throw new AppError('Blog not found', 404);
    return blog;
  }

  async updateBlog(slug: string, data: Partial<IBlog>, userId: string): Promise<IBlog> {
    const blog = await this.blogRepository.findBySlug(slug);
    if (!blog) throw new AppError('Blog not found', 404);

    if (blog.author._id.toString() !== userId.toString()) {
      throw new AppError('Not authorized to update this blog', 403);
    }

    if (data.title) {
      let newSlug = this.generateSlug(data.title);
      if (newSlug !== blog.slug) {
        const existing = await this.blogRepository.findBySlug(newSlug);
        if (existing) newSlug = `${newSlug}-${Date.now()}`;
        data.slug = newSlug;
      }
    }

    return (await this.blogRepository.update(blog._id.toString(), data))!;
  }

  async deleteBlog(slug: string, userId: string): Promise<boolean> {
    const blog = await this.blogRepository.findBySlug(slug);
    if (!blog) throw new AppError('Blog not found', 404);

    if (blog.author._id.toString() !== userId.toString()) {
      throw new AppError('Not authorized to delete this blog', 403);
    }

    return await this.blogRepository.delete(blog._id.toString());
  }
}
