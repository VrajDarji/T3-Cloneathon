import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up-dto';
import * as bcrypt from 'bcrypt';
import { LoginpDto } from './dto/login-dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async signUp(signUpDto: SignUpDto) {
    const { password, email, name } = signUpDto;
    const user = await this.findOneByEmail(email);

    if (user) {
      throw new HttpException(
        `User with email ${email} already exists`,
        HttpStatus.CONFLICT,
      );
    }

    try {
      let hashedPass = '';
      const salt = await bcrypt.genSalt();
      hashedPass = await bcrypt.hash(password, salt);
      const apiKey = crypto.randomBytes(32).toString('hex');
      const data = {
        email,
        name,
        apiKey,
        password: hashedPass,
      };
      const user = this.userRepository.create(data);
      await this.userRepository.save(user);

      const { accessToken, user: loginUser } = await this.login({
        email: signUpDto.email,
        password: signUpDto.password,
      });
      return { accessToken, loginUser };
    } catch (error) {
      throw new HttpException(
        `Failed to create user : ${error.messages}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginDto: LoginpDto) {
    try {
      const { password, email } = loginDto;
      const user = await this.findOneByEmail(email);

      if (!user) {
        throw new HttpException(
          `Cannot find user with given email`,
          HttpStatus.CONFLICT,
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new HttpException('Invalid Credential', HttpStatus.CONFLICT);
      }

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const token = this.jwtService.sign(payload);
      const { password: userPassword, apiKey, ...userWithoutPassword } = user;
      return { accessToken: token, user: userWithoutPassword };
    } catch (error) {
      throw new HttpException(
        `Failed to login user : ${error.messages}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
