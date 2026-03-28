import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import type { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private signAccessToken(user: { id: string; email: string; role: UserRole }): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.usersService.register(dto);
    return {
      accessToken: this.signAccessToken(user),
      user,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const row = await this.usersService.validateUser(dto.email, dto.password);
    const user = this.usersService.toUserResponse(row);
    return {
      accessToken: this.signAccessToken(user),
      user,
    };
  }
}
