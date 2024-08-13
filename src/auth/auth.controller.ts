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

  @Get('google/login')
  async googleLogin(@Res() res: Response) {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID');
    const redirectUri = encodeURIComponent(
      this.configService.get('GOOGLE_REDIRECT_URI'),
    );
    const scope = encodeURIComponent('profile email');
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    res.redirect(googleAuthUrl);
  }

  @Get('google')
  async googleCallback(@Query('code') code: string) {
    try {
      const tokenData = await this.authService.getGoogleToken(code);
      const userInfo = await this.authService.getGoogleUserInfo(
        tokenData.access_token,
      );

      // 여기서 사용자 정보를 처리하고 JWT 토큰을 생성하거나 세션을 만들 수 있습니다.
      return {
        message: '구글 로그인 성공',
        user: userInfo,
      };
    } catch (error) {
      console.error('Google login error:', error);
      return { message: '구글 로그인 실패', error: error.message };
    }
  }

  @Get('github/login')
  async githubLogin(@Res() res: Response) {
    const clientId = this.configService.get('GITHUB_CLIENT_ID');
    const redirectUri = encodeURIComponent(
      this.configService.get('GITHUB_REDIRECT_URI'),
    );
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
    res.redirect(githubAuthUrl);
  }

  @Get('github')
  async githubCallback(@Query('code') code: string) {
    try {
      const tokenData = await this.authService.getGithubToken(code);
      const userInfo = await this.authService.getGithubUserInfo(
        tokenData.access_token,
      );

      return {
        message: '깃허브 로그인 성공',
        user: userInfo,
      };
    } catch (error) {
      console.error('Github login error:', error);
      return { message: '깃허브 로그인 실패', error: error.message };
    }
  }
}
