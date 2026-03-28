import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CurrentUser } from './decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Current user profile' })
  @ApiOkResponse({ description: 'Current user (no password)', type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  async me(@CurrentUser() user: AuthenticatedUser): Promise<UserResponseDto> {
    return this.usersService.getMe(user);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update email and/or password (password re-hashed)' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiOkResponse({ description: 'Updated user (no password)', type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  @ApiConflictResponse({ description: 'Email already in use' })
  @ApiResponse({ status: 400, description: 'Validation failed or empty body' })
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateProfile(user.id, dto);
  }
}
