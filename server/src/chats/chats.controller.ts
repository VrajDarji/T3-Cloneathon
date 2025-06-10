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
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { chatDataFiltersDto } from './entities/chat.entity';
import { LoggedUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  async create(
    @Body() createChatDto: CreateChatDto,
    @LoggedUser() loggedUser: User,
  ) {
    if (!createChatDto.userId) {
      createChatDto.userId = loggedUser.id;
    }
    return await this.chatsService.create(createChatDto);
  }

  @Post('branch')
  async createBranch(
    @Body() createBranchDto: CreateChatDto,
    @LoggedUser() loggedUser: User,
  ) {
    const { parentId, branchedFromMsgId } = createBranchDto;
    if (!parentId || !branchedFromMsgId) {
      throw new HttpException(
        'Parent Id or Msg id not found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!createBranchDto.userId) {
      createBranchDto.userId = loggedUser.id;
    }

    return this.chatsService.createBranch(
      createBranchDto.parentId,
      createBranchDto.branchedFromMsgId,
      createBranchDto.userId,
    );
  }
  @Get('user/:userId')
  async findAllByUserId(
    @Param('userId', ParseUUIDPipe) id: string,
    @Query() chatDataFilters: chatDataFiltersDto,
  ) {
    return await this.chatsService.findAllByUserId(id, chatDataFilters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.chatsService.findOne(id);
  }

  @Get('public/:publicId')
  @Public()
  async getPublicChat(@Param('publicId') publicId: string) {
    return await this.chatsService.getPublicChat(publicId);
  }

  @Post('make-public/:chatId')
  async makePublic(@Param('chatId', ParseUUIDPipe) chatId: string) {
    return await this.chatsService.makePublicRoute(chatId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(id, updateChatDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.chatsService.remove(id);
  }
}
