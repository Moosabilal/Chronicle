import { IBaseRepository } from './IBaseRepository';
import { IBlog } from '../models/Blog';

export interface IBlogRepository extends IBaseRepository<IBlog> {
  findBySlug(slug: string): Promise<IBlog | null>;
  search(query: string, page: number, limit: number): Promise<{ blogs: IBlog[]; total: number }>;
}
