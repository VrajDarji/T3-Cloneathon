import { IsNotEmpty, IsOptional } from 'class-validator';
import { SenderType } from '../entities/senderType.enum';

export class CreateMessageDto {
  @IsNotEmpty()
  chatId: string;

  @IsNotEmpty()
  senderType: SenderType;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  codeSnippet: boolean;

  @IsOptional()
  language: string;
}
