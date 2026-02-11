import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserRepository } from '../../modules/user/infrastructure/user.repository';

// Extract JWT from Bearer header first, then fall back to cookie
function extractJwt(req: Request): string | null {
  // 1. Check Authorization header (Bearer token) — used by mobile clients
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // 2. Fall back to cookie — used by web clients
  if (req?.cookies?.['Authorization']) {
    return req.cookies['Authorization'] as string;
  }

  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepo: UserRepository,
  ) {
    const secret = configService.get<string>('SECRET');
    if (!secret) {
      throw new Error('SECRET environment variable is required for JWT');
    }
    super({
      jwtFromRequest: extractJwt,
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: string; exp: number }) {
    const user = await this.userRepo.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
