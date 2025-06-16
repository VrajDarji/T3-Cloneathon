import { IsNotEmpty, IsOptional } from 'class-validator';
import { Status } from '../entities/status.enum';

export class CreateChatDto {
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  title: string;

  @IsOptional()
  isPublic: boolean;

  @IsOptional()
  status: Status;

  @IsOptional()
  parentId: string;

  @IsOptional()
  sessionId: string;

  @IsOptional()
  branchedFromMsgId: string;
}
