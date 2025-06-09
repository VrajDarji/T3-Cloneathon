import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
