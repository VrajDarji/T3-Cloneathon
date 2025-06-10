import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat, chatDataFiltersDto } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { Status } from './entities/status.enum';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    try {
      const chat = this.chatRepository.create(createChatDto);
      return await this.chatRepository.save(chat);
    } catch (error) {
      throw new HttpException(
        `Failed to create chat ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllByUserId(userId: string, chatDataFilters: chatDataFiltersDto) {
    try {
      if (!userId) {
        throw new NotFoundException();
      }
      if (chatDataFilters) {
        // Status Filters
        const { status } = chatDataFilters;
        const users = await this.chatRepository.find({
          where: { userId, status },
        });
        return users;
      }
      const users = await this.chatRepository.find({
        where: { userId },
        order: { createdAt: 'ASC' },
      });
      return users;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch chats ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const chat = await this.chatRepository.findOne({ where: { id } });
      if (!chat) {
        throw new NotFoundException('Chat not found');
      }
      return chat;
    } catch (error) {
      throw new HttpException(
        `Error fetching data ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateChatDto: UpdateChatDto) {
    try {
      const chat = await this.findOne(id);
      if (!chat) {
        throw new NotFoundException('Chat not found');
      }
      Object.assign(chat, updateChatDto);

      return await this.chatRepository.save(chat);
    } catch (error) {
      throw new HttpException(
        `Error updating data ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      const chat = await this.findOne(id);
      if (!chat) {
        throw new NotFoundException('Chat not found');
      }
      return await this.chatRepository.remove(chat);
    } catch (error) {
      throw new HttpException(
        `Error deleting data ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async createBranch(
    parentId: string,
    branchedFromMsgId: string,
    userId: string,
  ) {
    try {
      const parentChat = await this.findOne(parentId);
      if (!parentChat) {
        throw new NotFoundException('Chat not found');
      }
      // Find parent and give branched a title branched from
      const newTitle = `Branched from -  ${parentChat.title}`;
      const createData: CreateChatDto = {
        title: newTitle,
        parentId,
        userId,
        branchedFromMsgId,
        isPublic: false,
        status: Status.ACTIVE,
      };
      // Create new branch with parentId and brancheFromMsgId
      const branchedChat = await this.create(createData);
      return await this.chatRepository.save(branchedChat);
    } catch (error) {
      throw new HttpException(
        `Error creating branch : ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async makePublicRoute(chatId: string) {
    try {
      const chat = await this.findOne(chatId);
      if (!chat) {
        throw new NotFoundException();
      }
      // Find chat which we want to make public
      // Mark it as public
      const updateData = {
        isPublic: true,
      };
      await this.update(chatId, updateData);

      // Create a one time access only publicId from which chat can be accessed
      // On Interface for usage generate a new route public / publicId
      const publicId = Buffer.from(chatId).toString('base64');
      return { publicId };
    } catch (error) {
      throw new HttpException(
        `Error making route public ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPublicChat(publicId: string) {
    const chatId = Buffer.from(publicId, 'base64').toString('utf-8');
    const publicChat = await this.chatRepository.findOne({
      where: { isPublic: true, id: chatId },
    });
    return publicChat;
  }
}
