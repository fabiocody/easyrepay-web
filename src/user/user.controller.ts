import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {UserDto} from '../model/dto/user.dto';
import {UserEntity} from '../model/entities/user.entity';

@Controller('user')
export class UserController {
    @UseGuards(JwtAuthGuard)
    @Get('')
    public async getMe(@Req() req): Promise<UserDto> {
        const user: UserEntity = req.user;
        return new UserDto({
            id: user.id,
            username: user.username,
            name: user.name,
        });
    }
}
