import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login success')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @Post('register')
  @ResponseMessage('Register a new user')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Get('account')
  @ResponseMessage('Get account info')
  getAccountInfo(@User() user: IUser) {
    return { user };
  }

  @Public()
  @Get('refresh')
  @ResponseMessage('Get User by refresh token')
  handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refresh_token = request.cookies['refresh_token'];
    console.log(refresh_token);
    return this.authService.processNewToken(refresh_token, response);
  }

  @Post('logout')
  @ResponseMessage('Logout User')
  handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
    return this.authService.logout(user, response);
  }

}
