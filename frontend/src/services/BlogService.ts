import api from '../api/axios'

export interface BlogAuthor {
  _id: string
  name: string
  avatar?: string
}

export interface BlogComment {
  _id: string
  content: string
  author: BlogAuthor
  createdAt: string
}

export interface Blog {
  _id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  tags: string[]
  author: BlogAuthor
  comments: BlogComment[]
  createdAt: string
}

export interface BlogListResponse {
  blogs: Blog[]
  total: number
}

export interface CreateBlogDto {
  title: string
  content: string
  excerpt?: string
  coverImage?: string
  tags?: string[]
}

export interface UpdateBlogDto {
  title?: string
  content?: string
  excerpt?: string
  coverImage?: string
  tags?: string[]
}

export class BlogService {
  static async getBlogs(params: { query?: string; page?: number; limit?: number; author?: string }): Promise<BlogListResponse> {
    try {
      const res = await api.get('/blogs', { params })
      return res.data.data as BlogListResponse
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? 'Could not load stories. Please try again.')
    }
  }

  static async getBlogBySlug(slug: string): Promise<Blog> {
    try {
      const res = await api.get(`/blogs/${slug}`)
      return res.data.data as Blog
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? 'Story not found or could not be loaded.')
    }
  }

  static async createBlog(data: CreateBlogDto): Promise<Blog> {
    try {
      const res = await api.post('/blogs', data)
      return res.data.data as Blog
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? 'Failed to publish. Please try again.')
    }
  }

  static async updateBlog(slug: string, data: UpdateBlogDto): Promise<Blog> {
    try {
      const res = await api.put(`/blogs/${slug}`, data)
      return res.data.data as Blog
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? 'Failed to update post.')
    }
  }

  static async deleteBlog(slug: string): Promise<void> {
    try {
      await api.delete(`/blogs/${slug}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? 'Failed to delete post.')
    }
  }

  static async addComment(slug: string, content: string): Promise<BlogComment> {
    try {
      const res = await api.post(`/blogs/${slug}/comments`, { content })
      return res.data.data as BlogComment
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? 'Could not post comment.')
    }
  }
}
