import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {BasicAuthGuard} from './guards/basic-auth.guard';
import {JwtAuthGuard} from './guards/jwt-auth.guard';
import {TokenDto} from '../model/dto/token.dto';
import {RefreshTokenDto} from '../model/dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(BasicAuthGuard)
    @Post('login')
    public async login(@Req() req): Promise<TokenDto> {
        return this.authService.login(req.user);
    }

    @Post('refresh-token')
    public async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenDto> {
        return this.authService.refreshToken(refreshTokenDto.token);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    public async logout(@Req() req, @Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
        return this.authService.logout(req.user, refreshTokenDto.token);
    }
}
