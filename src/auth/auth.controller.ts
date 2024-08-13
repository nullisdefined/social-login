import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @Get('kakao/login')
  async kakaoLogin(@Res() res: Response) {
    const clientId = this.configService.get('KAKAO_CLIENT_ID');
    const redirectUri = encodeURIComponent(
      this.configService.get('KAKAO_REDIRECT_URI'),
    );
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    res.redirect(kakaoAuthUrl);
  }

  @Get('kakao')
  async kakaoCallback(@Query('code') code: string) {
    try {
      const tokenData = await this.authService.getKakaoToken(code);
      const userInfo = await this.authService.getKakaoUserInfo(
        tokenData.access_token,
      );

      // 여기서 사용자 정보를 처리하고 JWT 토큰을 생성하거나 세션을 만들 수 있습니다.
      return {
        message: '카카오 로그인 성공',
        user: userInfo,
      };
    } catch (error) {
      console.error('Kakao login error:', error);
      return { message: '카카오 로그인 실패', error: error.message };
    }
  }
}
