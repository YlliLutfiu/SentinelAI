import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(user: AuthenticatedUser): Promise<UserResponseDto>;
    updateProfile(user: AuthenticatedUser, dto: UpdateProfileDto): Promise<UserResponseDto>;
}
