import { IComment } from '../../models/Comment';

export interface ICommentService {
  addComment(slug: string, content: string, userId: string): Promise<IComment>;
}
