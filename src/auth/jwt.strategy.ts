import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from './user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // 期限切れのトークンは無効
      secretOrKey: 'secretKey123',
    });
  }

  async validate(payload: { id: string; username: string }) {
    const { id, username } = payload;
    const user = await this.userRepository.findOne({
      id,
      username,
    });
    if (user) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
