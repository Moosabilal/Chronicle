import { Router } from 'express';
import { BlogController } from '../controllers/BlogController';
import { UploadController } from '../controllers/UploadController';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { upload } from '../middlewares/upload.middleware';
import { createBlogSchema, updateBlogSchema } from '../validations/blog.validation';
import { container } from '../container/inversify.config';
import TYPES from '../container/types';

const router = Router();
const blogController   = container.get<BlogController>(TYPES.BlogController);
const uploadController = container.get<UploadController>(TYPES.UploadController);

// ── Image upload ────────────────────────────────────────────────────────────
router.post('/upload', protect, upload.single('image'), uploadController.uploadImage);

// ── Blog CRUD ───────────────────────────────────────────────────────────────
router.route('/')
  .get(blogController.getBlogs)
  .post(protect, validate(createBlogSchema), blogController.createBlog);

router.route('/:slug')
  .get(blogController.getBlog)
  .put(protect, validate(updateBlogSchema), blogController.updateBlog)
  .delete(protect, blogController.deleteBlog);

// ── Comments ─────────────────────────────────────────────────────────────────
router.post('/:slug/comments', protect, blogController.addComment);

export default router;
