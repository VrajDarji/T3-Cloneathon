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
import { WebSearchService } from 'src/web-search/web-search.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly webSearchService: WebSearchService,
  ) {}

  async webSearch(query: string) {
    try {
      const results = await this.webSearchService.searchDuckDuckGo(query);
      return results;
    } catch (error) {
      throw new HttpException(
        `Error :${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

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

  async findAllByChatId(chatId: string) {
    try {
      if (!chatId) {
        throw new NotFoundException();
      }
      // Find messageParent
      const messagesParent = await this.messageRepository.findOne({
        where: { chatId },
        relations: ['chat'],
      });
      if (!messagesParent) {
        throw new NotFoundException();
      }
      // Check if parent chat is branched or not
      const { chat } = messagesParent;
      const isBranchedChat = chat.parentId !== null;

      // If not branched fetch all messages and send them
      if (!isBranchedChat) {
        const chatMessages = await this.messageRepository.find({
          where: { chatId },
          order: { createdAt: 'ASC' },
        });
        return chatMessages;
      }

      // If branched fetch message from parent chat from where branched
      const { branchedFromMsgId, parentId } = chat;
      const parentMessages = await this.messageRepository.find({
        where: { chatId: parentId as string },
        order: { createdAt: 'ASC' },
      });
      // Find index from where chat was branched (BranchedFromMsgId)
      const branchedPointIndex = parentMessages.findIndex(
        (msg) => msg.id === branchedFromMsgId,
      );
      if (branchedPointIndex === -1) {
        throw new NotFoundException(
          'Branching message not found in parent chat',
        );
      }
      // Filters messages before branching remove after branching
      const contextMessages = parentMessages.slice(0, branchedPointIndex + 1);
      //Fetch current chat msgs
      const BranchedChatMessages = await this.messageRepository.find({
        where: { chatId },
      });
      // Combine them and send
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

  async getPublicMessages(publicId: string) {
    try {
      // Same from public chat unique endpoint to get public chat messages
      // Passin publicId generatee after making chat public
      const chatId = Buffer.from(publicId, 'base64').toString('utf-8');
      const messages = await this.messageRepository.find({
        where: { chatId },
        order: { createdAt: 'ASC' },
      });
      return messages;
    } catch (error) {
      throw new HttpException(
        `Error fetching messages ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
