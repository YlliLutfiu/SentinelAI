import { User } from '@prisma/client';
import type { RegisterDto } from '../auth/dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    toUserResponse(user: User): UserResponseDto;
    register(dto: RegisterDto): Promise<UserResponseDto>;
    validateUser(email: string, password: string): Promise<User>;
    getMe(user: Pick<User, 'id' | 'email' | 'role' | 'createdAt' | 'updatedAt'>): Promise<UserResponseDto>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserResponseDto>;
}
