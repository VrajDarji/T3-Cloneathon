import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), ConfigModule],
  controllers: [ChatsController],
  providers: [ChatsService, JwtAuthGuard],
})
export class ChatsModule {}
