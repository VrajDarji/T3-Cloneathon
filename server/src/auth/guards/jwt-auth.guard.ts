import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authorization Required');
    }

    const request = context.switchToHttp().getRequest();

    const userId = request.cookies['userId'];
    if (userId && userId !== user.userId) {
      throw new UnauthorizedException('Invalid Session');
    }
    return user;
  }
}
