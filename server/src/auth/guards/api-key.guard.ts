import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Header finds for api_key and check user based on api key and authinticates
    const apiKey = request.headers['api_key'] || request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API Key missing');
    }

    const user = await this.userRepository.findOne({ where: { apiKey } });

    request.user = user;
    return true;
  }
}
