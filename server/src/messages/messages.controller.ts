import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get('chats/:chatId')
  async findAll(@Param('chatId', ParseUUIDPipe) id: string) {
    return await this.messagesService.findAllChatId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }

  @Get('public/:publicId')
  @Public()
  async getPublicMessages(@Param('publicId') id: string) {
    return await this.messagesService.getPublicMessages(id);
  }
}
