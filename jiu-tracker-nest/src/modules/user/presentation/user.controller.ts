import {
  Controller,
  Post,
  Put,
  Patch,
  Get,
  Body,
  Param,
  Req,
  Res,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { UserService } from '../application/user.service';
import { CreateUserDto } from '../application/dto/create-user.dto';
import { LoginUserDto } from '../application/dto/login-user.dto';
import { UpdateUserDto } from '../application/dto/update-user.dto';
import { UpdateAvatarDto } from '../application/dto/update-avatar.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BeltService } from '../../belt/application/belt.service';
import { UpdateBeltProgressDto } from 'src/modules/belt/application/dto/update-belt-progress.dto';

interface LatestBelt {
  belt_color: string;
  belt_stripe: number;
}

@Controller('api')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly beltService: BeltService,
  ) {}

  @Post('user/signup')
  async createUser(@Body() dto: CreateUserDto) {
    try {
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
      const loginResponse = await this.userService.login(dto);

      res.cookie('Authorization', loginResponse.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 3600 * 24 * 1000, // 24 hours in ms
      });

      return res.status(HttpStatus.OK).json(loginResponse);
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
  @Get('user/me')
  async getMe(
    @Req()
    req: Request & {
      user: {
        id: string;
        username: string;
        name: string;
        avatar: string;
        email: string;
        password?: string;
      };
    },
  ) {
    const { password, ...user } = req.user;
    void password; // exclude from response
    const belt: LatestBelt | null =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- BeltService from DI
      (await this.beltService.getLatestBeltForUser(
        req.user.id,
      )) as LatestBelt | null;
    return {
      user: {
        ...user,
        belt_color: belt?.belt_color,
        belt_stripe: belt?.belt_stripe ?? 0,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.userService.getUserById(id);
      const { password, ...safeUser } = user;
      void password;
      const belt: LatestBelt | null =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- BeltService from DI
        (await this.beltService.getLatestBeltForUser(id)) as LatestBelt | null;
      return {
        user: {
          ...safeUser,
          belt_color: belt?.belt_color,
          belt_stripe: belt?.belt_stripe ?? 0,
        },
      };
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

  @UseGuards(JwtAuthGuard)
  @Put('user/:id/belt')
  async updateBelt(
    @Param('id') id: string,
    @Body() dto: UpdateBeltProgressDto,
  ) {
    try {
      const beltProgress = await this.beltService.updateBeltProgress(dto);
      return { beltProgress };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user/:id/avatar')
  async updateAvatar(@Param('id') id: string, @Body() dto: UpdateAvatarDto) {
    try {
      const user = await this.userService.updateUserAvatar(id, dto.avatar);
      return { user };
    } catch (error) {
      throw new HttpException(
        { error: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
