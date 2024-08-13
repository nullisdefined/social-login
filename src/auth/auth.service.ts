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
}
