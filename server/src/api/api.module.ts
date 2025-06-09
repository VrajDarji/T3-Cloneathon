import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ApiKeyAuthGuard } from 'src/auth/guards/api-key.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule],
  controllers: [ApiController],
  providers: [ApiService, ApiKeyAuthGuard],
})
export class ApiModule {}
