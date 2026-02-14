import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Param,
  Res,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { UserService } from '../application/user.service';
import { CreateUserDto } from '../application/dto/create-user.dto';
import { LoginUserDto } from '../application/dto/login-user.dto';
import { UpdateUserDto } from '../application/dto/update-user.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user/signup')
  async createUser(@Body() dto: CreateUserDto) {
    try {
      // Log the dto in the console
      // console.log doesn't work in the terminal, so we use console.log directly
      console.log('dto', dto);

      const user = await this.userService.createUser(dto);
      return { user };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('user/login')
  async loginUser(@Body() dto: LoginUserDto, @Res() res: Response) {
    try {
      const token = await this.userService.login(dto);

      res.cookie('Authorization', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 3600 * 24 * 1000, // 24 hours in ms
      });

      return res.status(HttpStatus.OK).json({ token });
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/validate')
  validate() {
    return { message: "I'm logged in" };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.userService.getUserById(id);
      return { user };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAllUsers() {
    try {
      const users = await this.userService.getAllUsers();
      return { users };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('user/:id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    try {
      const user = await this.userService.updateUser(id, dto);
      return { user };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
