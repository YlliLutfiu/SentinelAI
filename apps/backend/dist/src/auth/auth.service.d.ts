import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    private signAccessToken;
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
}
