import { Chat } from 'src/chats/entities/chat.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SenderType } from './senderType.enum';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'chat_id', type: 'uuid' })
  chatId: string;

  @ManyToOne(() => Chat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @Column({ type: 'enum', enum: SenderType, name: 'sender_type' })
  senderType: SenderType;

  @Column({ name: 'content', type: 'varchar' })
  content: string;

  @Column({ name: 'code_snippet', type: 'boolean' })
  codeSnippet: boolean;

  @Column({ name: 'language', type: 'varchar' })
  language: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
