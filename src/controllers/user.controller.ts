import {UserDto} from '../model/dto/user.dto';
import {UserEntity} from '../model/user.entity';
import {Authorized, CurrentUser, Get, JsonController} from 'routing-controllers';

@JsonController()
export class UserController {
    @Authorized()
    @Get('/me')
    public async getMe(@CurrentUser() user: UserEntity): Promise<UserDto> {
        return new UserDto({
            id: user.id,
            username: user.username,
            name: user.name,
        });
    }
}
