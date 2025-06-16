import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WebSearchModule } from 'src/web-search/web-search.module';
import { ConfigModule } from '@nestjs/config';
import { Chat } from 'src/chats/entities/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Chat]),
    WebSearchModule,
    ConfigModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, JwtAuthGuard],
})
export class MessagesModule {}
