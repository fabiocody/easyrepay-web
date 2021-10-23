import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {UserDto} from '../model/dto/user.dto';
import {UserService} from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    public async getMe(@Req() req): Promise<UserDto> {
        const user = await this.userService.get(req.user);
        return new UserDto({
            id: user.id,
            username: user.username,
            name: user.name,
        });
    }
}
