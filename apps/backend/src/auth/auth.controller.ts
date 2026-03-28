import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user (role USER) and receive JWT' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'User created; includes JWT accessToken',
    type: AuthResponseDto,
  })
  @ApiConflictResponse({ description: 'Email already registered' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password; receive JWT' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Authenticated with JWT accessToken',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }
}
