import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async getKakaoToken(code: string) {
    const tokenUrl = 'https://kauth.kakao.com/oauth/token';
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.configService.get('KAKAO_CLIENT_ID'),
      redirect_uri: this.configService.get('KAKAO_REDIRECT_URI'),
      code,
    });

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(tokenUrl, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        }),
      );
      console.log(data);
      return data;
    } catch (error) {
      console.error('카카오 토큰을 가져오는 데 실패했습니다.', error);
      throw error;
    }
  }

  async getKakaoUserInfo(accessToken: string) {
    const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(userInfoUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (error) {
      console.error('카카오 사용자 정보를 가져오는 데 실패했습니다.', error);
      throw error;
    }
  }

  async getGoogleToken(code: string) {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams({
      code,
      client_id: this.configService.get('GOOGLE_CLIENT_ID'),
      client_secret: this.configService.get('GOOGLE_CLIENT_SECRET'),
      redirect_uri: this.configService.get('GOOGLE_REDIRECT_URI'),
      grant_type: 'authorization_code',
    });

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(tokenUrl, params.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );
      return data;
    } catch (error) {
      console.error('구글 토큰을 가져오는 데 실패했습니다.', error);
      throw error;
    }
  }

  async getGoogleUserInfo(accessToken: string) {
    const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(userInfoUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (error) {
      console.error('구글 사용자 정보를 가져오는 데 실패했습니다.', error);
      throw error;
    }
  }

  async getGithubToken(code: string) {
    const tokenUrl = 'https://github.com/login/oauth/access_token';
    const params = new URLSearchParams({
      client_id: this.configService.get('GITHUB_CLIENT_ID'),
      client_secret: this.configService.get('GITHUB_CLIENT_SECRET'),
      code,
      redirect_uri: this.configService.get('GITHUB_REDIRECT_URI'),
    });

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(tokenUrl, params, {
          headers: {
            Accept: 'application/json',
          },
        }),
      );
      return data;
    } catch (error) {
      console.error('깃허브 토큰을 가져오는 데 실패했습니다.', error);
      throw error;
    }
  }

  async getGithubUserInfo(accessToken: string) {
    const userInfoUrl = 'https://api.github.com/user';
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(userInfoUrl, {
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }),
      );
      return data;
    } catch (error) {
      console.error('깃허브 사용자 정보를 가져오는 데 실패했습니다.', error);
      throw error;
    }
  }
}
