import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../infrastructure/user.repository';
import { BeltService } from '../../belt/application/belt.service';
import { User } from '../domain/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginResponse } from '@jiu-tracker/shared';
import { DeleteResult } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly beltService: BeltService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    if (!dto.name || !dto.email || !dto.password) {
      throw new Error('Name, email, and password are required');
    }
    if (!dto.belt_color || dto.belt_stripe < 0) {
      throw new Error('Belt color and stripe are required');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepo.create({
      name: dto.name,
      username: dto.username,
      email: dto.email,
      password: hash,
      avatar: '',
    });

    // Add belt progress
    await this.beltService.createBeltProgress({
      userId: user.id,
      color: dto.belt_color,
      stripes: dto.belt_stripe,
    });

    this.logger.log({
      event: 'user.create.completed',
      userId: user.id,
    });

    return user;
  }

  async login(dto: LoginUserDto): Promise<LoginResponse> {
    if (!dto.email || !dto.password) {
      throw new Error('Email and password are required');
    }

    const user = await this.userRepo.findByEmail(dto.email);

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Wrong password');
    }

    const token = this.jwtService.sign({
      sub: user.id,
    });

    this.logger.log({
      event: 'user.login.completed',
      userId: user.id,
    });

    return { access_token: token, user };
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepo.findById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepo.findAll();
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findById(id);
    const beltProgress: { belt_color: string; belt_stripe: number } | null =
      await this.beltService.getLatestBeltForUser(id);
    const currentBeltColor = beltProgress?.belt_color;
    const currentBeltStripe = beltProgress?.belt_stripe;

    user.name = dto.name;
    user.username = dto.username;
    user.email = dto.email;
    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    const updatedUser = await this.userRepo.update(user);

    if (
      currentBeltColor !== dto.belt_color ||
      currentBeltStripe !== dto.belt_stripe
    ) {
      await this.beltService.createBeltProgress({
        userId: updatedUser.id,
        color: dto.belt_color,
        stripes: dto.belt_stripe,
      });
    }

    this.logger.log({
      event: 'user.update.completed',
      userId: updatedUser.id,
    });

    return updatedUser;
  }

  async updateUserAvatar(
    id: string,
    avatar: string | undefined,
  ): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (avatar !== undefined) {
      user.avatar = avatar;
    }
    const updatedUser = await this.userRepo.update(user);
    this.logger.log({
      event: 'user.avatar.updated',
      userId: updatedUser.id,
    });
    return updatedUser;
  }

  async setPremium(userId: string, premium: boolean): Promise<User> {
    const user = await this.userRepo.findById(userId);
    user.isPremium = premium;
    const updatedUser = await this.userRepo.update(user);
    this.logger.log({
      event: 'user.premium.updated',
      userId,
      premium,
    });
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const deleteResult: void | DeleteResult =
      await this.userRepo.delete(userId);
    const deleted: boolean = Boolean(
      deleteResult && deleteResult.affected && deleteResult.affected > 0,
    );

    this.logger.log({
      event: 'user.deleted',
      userId,
      deleted,
    });
    return deleted;
  }
}
