import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const existing = await this.repo.findOne({
      where: { email: user.email },
    });
    if (existing) {
      throw new Error(`User with email ${user.email} already exists`);
    }

    user.id = uuidv4();
    const entity = this.repo.create(user);
    return this.repo.save(entity);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) {
      throw new Error(`Failed to find user with email ${email}`);
    }
    return user;
  }

  async update(user: User): Promise<User> {
    return this.repo.save(user);
  }

  async findById(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new Error(`Failed to find user with id ${id}`);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async delete(id: string): Promise<void | DeleteResult> {
    return await this.repo.delete(id);
  }
}
