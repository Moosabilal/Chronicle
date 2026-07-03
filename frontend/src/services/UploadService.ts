import api from '../api/axios'

export class UploadService {
  static async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await api.post('/blogs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      return res.data.data.url as string
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? 'Image upload failed. Please try again.')
    }
  }
}
