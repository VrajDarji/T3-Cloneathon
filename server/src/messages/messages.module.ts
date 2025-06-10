import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WebSearchModule } from 'src/web-search/web-search.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), WebSearchModule],
  controllers: [MessagesController],
  providers: [MessagesService, JwtAuthGuard],
})
export class MessagesModule {}
