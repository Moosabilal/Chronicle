import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { IBlogService } from '../interfaces/services/IBlogService';
import { ICommentService } from '../interfaces/services/ICommentService';
import TYPES from '../container/types';

@injectable()
export class BlogController {
  constructor(
    @inject(TYPES.IBlogService)    private blogService: IBlogService,
    @inject(TYPES.ICommentService) private commentService: ICommentService
  ) {}

  createBlog = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const blog = await this.blogService.createBlog(req.body, userId);
    res.status(201).json({ success: true, data: blog });
  });

  getBlogs = catchAsync(async (req: Request, res: Response) => {
    const query = String(req.query.query || '');
    const page  = parseInt(String(req.query.page  || '1'),  10);
    const limit = parseInt(String(req.query.limit || '10'), 10);

    const result = await this.blogService.getBlogs(query, page, limit);
    res.status(200).json({ success: true, data: result });
  });

  getBlog = catchAsync(async (req: Request, res: Response) => {
    const blog = await this.blogService.getBlogBySlug(String(req.params.slug));
    res.status(200).json({ success: true, data: blog });
  });

  updateBlog = catchAsync(async (req: Request, res: Response) => {
    const updatedBlog = await this.blogService.updateBlog(
      String(req.params.slug),
      req.body,
      req.user!.id
    );
    res.status(200).json({ success: true, data: updatedBlog });
  });

  deleteBlog = catchAsync(async (req: Request, res: Response) => {
    await this.blogService.deleteBlog(String(req.params.slug), req.user!.id);
    res.status(200).json({ success: true, data: null });
  });

  addComment = catchAsync(async (req: Request, res: Response) => {
    const comment = await this.commentService.addComment(
      String(req.params.slug),
      req.body.content,
      req.user!.id
    );
    res.status(201).json({ success: true, data: comment });
  });
}
