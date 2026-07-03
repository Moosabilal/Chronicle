import api from '../api/axios'

export interface AuthUser {
  _id: string
  name: string
  email: string
  avatar?: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export class AuthService {
  static async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    try {
      const res = await api.post('/auth/register', data)
      return res.data.data as AuthResponse
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? 'Registration failed. Please try again.')
    }
  }

  static async login(data: { email: string; password: string }): Promise<AuthResponse> {
    try {
      const res = await api.post('/auth/login', data)
      return res.data.data as AuthResponse
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? 'Login failed. Please check your credentials.')
    }
  }
  static async forgotPassword(email: string): Promise<string> {
    try {
      const res = await api.post('/auth/forgot-password', { email })
      return res.data.message
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? 'Failed to send reset email.')
    }
  }

  static async resetPassword(token: string, password: string): Promise<string> {
    try {
      const res = await api.put(`/auth/reset-password/${token}`, { password })
      return res.data.message
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? 'Failed to reset password.')
    }
  }
}
