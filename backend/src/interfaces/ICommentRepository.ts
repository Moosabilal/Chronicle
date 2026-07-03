import { IBaseRepository } from './IBaseRepository';
import { IComment } from '../models/Comment';

export interface ICommentRepository extends IBaseRepository<IComment> {
  findByBlogId(blogId: string): Promise<IComment[]>;
}
