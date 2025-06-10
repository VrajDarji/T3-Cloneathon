import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    try {
      const message = this.messageRepository.create(createMessageDto);
      return await this.messageRepository.save(message);
    } catch (error) {
      throw new HttpException(
        `Failed to create message : ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllChatId(chatId: string) {
    try {
      if (!chatId) {
        throw new NotFoundException();
      }
      const messagesParent = await this.messageRepository.findOne({
        where: { chatId },
        relations: ['chat'],
      });
      if (!messagesParent) {
        throw new NotFoundException();
      }
      const { chat } = messagesParent;
      const isBranchedChat = chat.parentId !== null;
      if (!isBranchedChat && !chat.parentId) {
        const chatMessages = await this.messageRepository.find({
          where: { chatId },
          order: { createdAt: 'ASC' },
        });
        return chatMessages;
      }

      const { branchedFromMsgId, parentId } = chat;
      const parentMessages = await this.messageRepository.find({
        where: { chatId: parentId as string },
        order: { createdAt: 'ASC' },
      });
      const branchedPointIndex = parentMessages.findIndex(
        (msg) => msg.id === branchedFromMsgId,
      );
      if (branchedPointIndex === -1) {
        throw new NotFoundException(
          'Branching message not found in parent chat',
        );
      }
      const contextMessages = parentMessages.slice(0, branchedPointIndex + 1);
      const BranchedChatMessages = await this.messageRepository.find({
        where: { chatId },
      });
      const allMessages = [...contextMessages, ...BranchedChatMessages];
      return allMessages;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch messages : ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const msg = await this.messageRepository.findOne({ where: { id } });
      if (!msg) {
        throw new NotFoundException('Message not found');
      }
      return msg;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch message : ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    try {
      const msg = await this.findOne(id);
      if (!msg) {
        throw new NotFoundException('Message not found');
      }
      Object.assign(msg, updateMessageDto);
      return await this.messageRepository.save(msg);
    } catch (error) {
      throw new HttpException(
        `Failed to update message : ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      const msg = await this.findOne(id);
      if (!msg) {
        throw new NotFoundException('Chat not found');
      }
      return await this.messageRepository.remove(msg);
    } catch (error) {
      throw new HttpException(
        `Error deleting data ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
