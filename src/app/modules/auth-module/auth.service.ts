import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import { EmailService } from '../email-module/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = randomUUID();

    // Store refresh token in Redis with 7 days expiration (in milliseconds)
    await this.cacheManager.set(`refresh_token:${refreshToken}`, user.id, 604800000);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: user,
    };
  }

  async logout(refreshToken: string) {
    await this.cacheManager.del(`refresh_token:${refreshToken}`);
  }

  async refresh(refreshToken: string) {
    const userId = await this.cacheManager.get<string>(`refresh_token:${refreshToken}`);
    if (!userId) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = { email: user.email, sub: user.id };
    const newAccessToken = this.jwtService.sign(payload);

    return {
      access_token: newAccessToken,
      refresh_token: refreshToken, // Return same refresh token
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const { password, ...result } = user;
    return this.login(result);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User with this email does not exist');
    }

    const resetToken = randomUUID();

    await this.cacheManager.set(`reset_token:${resetToken}`, user.id, 3600000); // 1 hour expiration
    
    // Send email
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return  {message: 'Password reset email sent', status: 'success' };
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = await this.cacheManager.get<string>(`reset_token:${token}`);
    if (!userId) {
      throw new UnauthorizedException('Invalid or expired password reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(userId, { password: hashedPassword });

    await this.cacheManager.del(`reset_token:${token}`);

    return { message: 'Password has been reset successfully', status: 'success' };
  }
}
