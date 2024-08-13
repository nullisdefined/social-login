// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-kakao';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
//   constructor(private configService: ConfigService) {
//     super({
//       clientID: configService.get<string>('KAKAO_CLIENT_ID'),
//       callbackURL: configService.get<string>('KAKAO_REDIRECT_URI'),
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: any,
//   ) {
//     const { id, username, _json } = profile;
//     const user = {
//       id: id,
//       username: username,
//       email: _json.kakao_account?.email,
//     };
//     done(null, user);
//   }
// }
