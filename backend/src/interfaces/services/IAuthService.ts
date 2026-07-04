import { IUser } from '../../models/User';

export interface IAuthService {
  register(data: Partial<IUser>): Promise<{ user: Partial<IUser>; token: string }>;
  login(data: Partial<IUser>): Promise<{ user: Partial<IUser>; token: string }>;
  forgotPassword(email: string): Promise<boolean>;
  resetPassword(token: string, password: string): Promise<boolean>;
  updateProfile(userId: string, data: { name?: string; avatar?: string }): Promise<Partial<IUser>>;
}
