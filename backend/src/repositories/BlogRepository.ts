import 'reflect-metadata';
import { injectable } from 'inversify';
import { Blog, IBlog } from '../models/Blog';
import { BaseRepository } from './BaseRepository';
import { IBlogRepository } from '../interfaces/IBlogRepository';

@injectable()
export class BlogRepository extends BaseRepository<IBlog> implements IBlogRepository {
  constructor() {
    super(Blog);
  }

  async findBySlug(slug: string): Promise<IBlog | null> {
    return await this.model.findOne({ slug }).populate('author', 'name avatar').populate('comments').exec();
  }

  async search(query: string, page: number, limit: number): Promise<{ blogs: IBlog[]; total: number }> {
    const filter = query ? { title: { $regex: query, $options: 'i' } } : {};
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('author', 'name avatar').exec(),
      this.count(filter),
    ]);

    return { blogs, total };
  }
}
