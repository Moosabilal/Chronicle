import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { AppError } from '../utils/AppError';
import { IComment } from '../models/Comment';
import { ICommentService } from '../interfaces/services/ICommentService';
import { ICommentRepository } from '../interfaces/ICommentRepository';
import { IBlogRepository } from '../interfaces/IBlogRepository';
import TYPES from '../container/types';

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject(TYPES.ICommentRepository) private commentRepository: ICommentRepository,
    @inject(TYPES.IBlogRepository)    private blogRepository: IBlogRepository
  ) {}

  async addComment(slug: string, content: string, userId: string): Promise<IComment> {
    if (!content?.trim()) throw new AppError('Comment content is required', 400);

    const blog = await this.blogRepository.findBySlug(slug);
    if (!blog) throw new AppError('Blog not found', 404);

    const comment = await this.commentRepository.create({
      author: userId as any,
      blogId: blog._id as any,
      content,
    });

    // Push comment reference into blog
    await this.blogRepository.update(blog._id.toString(), { $push: { comments: comment._id } } as any);

    const populated = await comment.populate('author', 'name avatar');
    return populated;
  }
}
