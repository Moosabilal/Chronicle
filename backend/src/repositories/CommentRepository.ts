import 'reflect-metadata';
import { injectable } from 'inversify';
import { Comment, IComment } from '../models/Comment';
import { BaseRepository } from './BaseRepository';
import { ICommentRepository } from '../interfaces/ICommentRepository';

@injectable()
export class CommentRepository extends BaseRepository<IComment> implements ICommentRepository {
  constructor() {
    super(Comment);
  }

  async findByBlogId(blogId: string): Promise<IComment[]> {
    return await this.model.find({ blogId }).populate('author', 'name avatar').sort({ createdAt: -1 }).exec();
  }
}
