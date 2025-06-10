import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up-dto';
import { LoginpDto } from './dto/login-dto';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    console.log({ signUpDto });

    await this.authService.signUp(signUpDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, user } = await this.authService.login(loginDto);

    this.assignCookieToResponse(response, accessToken, user.id);

    return { accessToken, user };
  }

  private assignCookieToResponse(
    response: Response,
    accessToken: string,
    userCookieData,
  ) {
    const NODE_ENV = this.configService.get('NODE_ENV');
    const cookieExpiry = new Date(
      new Date().getTime() +
        this.configService.get('JWT_COOKIE_EXPIRY') * 24 * 60 * 60 * 1000,
    );
    const cookieOptions: CookieOptions = {
      expires: cookieExpiry,
      httpOnly: true,
      secure: NODE_ENV !== 'development',
      sameSite: NODE_ENV === 'development' ? 'lax' : 'none',
      path: '/',
    };

    response.cookie('accessToken', accessToken, cookieOptions);
    response.cookie('userId', userCookieData, cookieOptions);
  }
}
