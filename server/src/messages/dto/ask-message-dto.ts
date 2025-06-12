import { IsNotEmpty, IsOptional } from 'class-validator';
import { SenderType } from '../entities/senderType.enum';

export class AskMessageDto {
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

  @IsOptional()
  model: string;
}
