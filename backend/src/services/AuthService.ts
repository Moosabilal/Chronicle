import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Resend } from 'resend';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { IUser } from '../models/User';
import { IAuthService } from '../interfaces/services/IAuthService';
import { IUserRepository } from '../interfaces/IUserRepository';
import TYPES from '../container/types';

const resend = new Resend(env.RESEND_API_KEY);

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

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('There is no user with that email', 404);
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.userRepository.update(user._id.toString(), {
      resetPasswordToken,
      resetPasswordExpire,
    });

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    try {
      await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>', // Free test tier requires this domain
        to: user.email,
        subject: 'Chronicle: Password Reset Request',
        html: `<p>You requested a password reset. Click the link below to reset your password (valid for 10 minutes):</p>
               <a href="${resetUrl}">${resetUrl}</a>`,
      });
      console.log(`Password reset email sent to ${user.email} (Link: ${resetUrl})`);
    } catch (err) {
      await this.userRepository.update(user._id.toString(), {
        $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 }
      } as any);
      throw new AppError('Email could not be sent', 500);
    }

    return true;
  }

  async resetPassword(token: string, password: string): Promise<boolean> {
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.userRepository.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError('Invalid or expired token', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.userRepository.update(user._id.toString(), {
      password: hashedPassword,
      $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 }
    } as any);

    return true;
  }
}
