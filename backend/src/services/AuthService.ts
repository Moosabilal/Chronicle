import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { IUser } from '../models/User';
import { IAuthService } from '../interfaces/services/IAuthService';
import { IUserRepository } from '../interfaces/IUserRepository';
import TYPES from '../container/types';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  private generateToken(id: string): string {
    return jwt.sign({ id }, env.JWT_SECRET, { expiresIn: '7d' });
  }

  async register(data: Partial<IUser>): Promise<{ user: Partial<IUser>; token: string }> {
    const { name, email, password, avatar } = data;

    if (!email || !password || !name) {
      throw new AppError('Please provide name, email and password', 400);
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email is already registered', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.userRepository.create({ name, email, password: hashedPassword, avatar });

    const token = this.generateToken(user._id.toString());
    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
  }

  async login(data: Partial<IUser>): Promise<{ user: Partial<IUser>; token: string }> {
    const { email, password } = data;

    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = this.generateToken(user._id.toString());
    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
  }
}
