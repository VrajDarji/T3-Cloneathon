import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Status } from './status.enum';
import { User } from 'src/users/entities/user.entity';
import { Message } from 'src/messages/entities/message.entity';
import { IsOptional } from 'class-validator';

@Entity({ name: 'chats' })
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'parent_id', type: 'uuid', default: null })
  parentId: string | null;

  @ManyToOne(() => Chat, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: Chat;

  @Column({ name: 'branched_from_msg_id', type: 'uuid', default: null })
  branchedFromMsgId: string | null;

  @ManyToOne(() => Message, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'branched_from_msg_id' })
  branchedFromMsg: Message;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Column({ name: 'is_public', type: 'boolean', default: false })
  isPublic: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

export class chatDataFiltersDto {
  @IsOptional()
  status: Status;
}
