import { Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { Comment } from '../models/Comment'
import { Blog } from '../models/Blog'
import { AppError } from '../utils/AppError'

export const addComment = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params
  const { content } = req.body
  const userId = req.user?.id

  if (!content?.trim()) throw new AppError('Comment content is required', 400)

  const blog = await Blog.findOne({ slug })
  if (!blog) throw new AppError('Blog not found', 404)

  const comment = await Comment.create({ author: userId, blogId: blog._id, content })
  await Blog.findByIdAndUpdate(blog._id, { $push: { comments: comment._id } })

  const populated = await comment.populate('author', 'name avatar')
  res.status(201).json({ success: true, data: populated })
})
