import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import type { RegisterDto } from '../auth/dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async register(dto: RegisterDto): Promise<UserResponseDto> {
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase(),
          password: passwordHash,
          role: UserRole.USER,
        },
      });
      return this.toUserResponse(user);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Email already registered');
      }
      throw e;
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  async getMe(user: Pick<User, 'id' | 'email' | 'role' | 'createdAt' | 'updatedAt'>): Promise<UserResponseDto> {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserResponseDto> {
    if (dto.email === undefined && dto.password === undefined) {
      throw new BadRequestException('Provide at least email or password to update');
    }

    const data: Prisma.UserUpdateInput = {};
    if (dto.email !== undefined) {
      data.email = dto.email.toLowerCase();
    }
    if (dto.password !== undefined) {
      data.password = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data,
      });
      return this.toUserResponse(user);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Email already in use');
      }
      throw e;
    }
  }
}
