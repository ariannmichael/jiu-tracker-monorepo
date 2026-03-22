import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { UserService } from './user.service';
import { UserRepository } from '../infrastructure/user.repository';
import { BeltService } from '../../belt/application/belt.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../domain/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let mockUserRepo: jest.Mocked<{
    create: jest.Mock;
    findByEmail: jest.Mock;
    findById: jest.Mock;
    update: jest.Mock;
    findAll: jest.Mock;
  }>;
  let mockBeltService: jest.Mocked<
    Pick<BeltService, 'createBeltProgress' | 'getLatestBeltForUser'>
  >;
  let mockJwtService: jest.Mocked<Pick<JwtService, 'sign'>>;
  let mockDataSource: jest.Mocked<Pick<DataSource, 'transaction'>>;

  const hashedPassword = 'hashed-password';

  beforeEach(() => {
    jest.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);
    jest.mocked(bcrypt.compare).mockResolvedValue(true as never);

    mockUserRepo = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
    };
    mockBeltService = {
      createBeltProgress: jest.fn(),
      getLatestBeltForUser: jest.fn().mockResolvedValue({
        belt_color: 'Blue Belt',
        belt_stripe: 0,
      }),
    };
    mockJwtService = {
      sign: jest.fn().mockReturnValue('jwt-token'),
    };
    mockDataSource = {
      transaction: jest.fn(async (cb: (m: unknown) => Promise<void>) => {
        await cb({
          delete: jest.fn().mockResolvedValue({ affected: 1 }),
        });
      }),
    };
    service = new UserService(
      mockUserRepo as unknown as UserRepository,
      mockBeltService as unknown as BeltService,
      mockJwtService as unknown as JwtService,
      mockDataSource as unknown as DataSource,
    );
  });

  describe('createUser', () => {
    it('successful creation', async () => {
      const dto: CreateUserDto = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        belt_color: 'blue',
        belt_stripe: 2,
      };
      const createdUser: User = {
        id: 'test-user-id',
        name: dto.name,
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        avatar: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUserRepo.create.mockResolvedValue(createdUser);
      mockBeltService.createBeltProgress.mockResolvedValue({} as never);

      const result = await service.createUser(dto);

      expect(result.name).toBe(dto.name);
      expect(result.email).toBe(dto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(mockUserRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: dto.name,
          username: dto.username,
          email: dto.email,
        }),
      );
      expect(mockBeltService.createBeltProgress).toHaveBeenCalledWith({
        userId: createdUser.id,
        color: dto.belt_color,
        stripes: dto.belt_stripe,
      });
    });

    it('throws when name, email or password missing', async () => {
      await expect(
        service.createUser({
          name: '',
          username: 'u',
          email: '',
          password: '',
          belt_color: 'blue',
          belt_stripe: 0,
        }),
      ).rejects.toThrow('Name, email, and password are required');
      expect(mockUserRepo.create).not.toHaveBeenCalled();
    });

    it('throws when belt color or stripe missing', async () => {
      await expect(
        service.createUser({
          name: 'John',
          username: 'johndoe',
          email: 'j@e.com',
          password: 'pass123',
          belt_color: '',
          belt_stripe: -1,
        }),
      ).rejects.toThrow('Belt color and stripe are required');
      expect(mockUserRepo.create).not.toHaveBeenCalled();
    });

    it('propagates repository error', async () => {
      const dto: CreateUserDto = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        belt_color: 'blue',
        belt_stripe: 2,
      };
      mockUserRepo.create.mockRejectedValue(new Error('database error'));

      await expect(service.createUser(dto)).rejects.toThrow('database error');
    });

    it('propagates belt progress error', async () => {
      const dto: CreateUserDto = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        belt_color: 'blue',
        belt_stripe: 2,
      };
      mockUserRepo.create.mockResolvedValue({
        id: 'id',
        name: dto.name,
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        avatar: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockBeltService.createBeltProgress.mockRejectedValue(
        new Error('belt service error'),
      );

      await expect(service.createUser(dto)).rejects.toThrow(
        'belt service error',
      );
    });
  });

  describe('login', () => {
    it('successful login', async () => {
      const dto: LoginUserDto = {
        email: 'john@example.com',
        password: 'password123',
      };
      const user: User = {
        id: 'test-user-id',
        name: 'John',
        username: 'johndoe',
        email: dto.email,
        password: hashedPassword,
        avatar: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPremium: false,
        subscriptionExpiresAt: null,
      };
      mockUserRepo.findByEmail.mockResolvedValue(user);
      mockUserRepo.findById.mockResolvedValue(user);

      const token = await service.login(dto);

      expect(token.access_token).toBe('jwt-token');
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: user.id });
    });

    it('throws when email or password missing', async () => {
      await expect(
        service.login({ email: '', password: '' }),
      ).rejects.toThrow('Email and password are required');
      expect(mockUserRepo.findByEmail).not.toHaveBeenCalled();
    });

    it('throws when user not found', async () => {
      mockUserRepo.findByEmail.mockRejectedValue(
        new Error('Failed to find user'),
      );

      await expect(
        service.login({
          email: 'notfound@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow();
    });

    it('throws on wrong password', async () => {
      const user: User = {
        id: 'test-user-id',
        name: 'John',
        username: 'johndoe',
        email: 'john@example.com',
        password: hashedPassword,
        avatar: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUserRepo.findByEmail.mockResolvedValue(user);
      jest.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        service.login({
          email: 'john@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow('Wrong password');
    });
  });

  describe('getUserById', () => {
    it('successful retrieval', async () => {
      const user: User = {
        id: 'test-user-id',
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'hash',
        avatar: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUserRepo.findById.mockResolvedValue(user);

      const result = await service.getUserById('test-user-id');

      expect(result.id).toBe('test-user-id');
      expect(result.name).toBe('John Doe');
    });

    it('propagates repository error', async () => {
      mockUserRepo.findById.mockRejectedValue(
        new Error('Failed to find user'),
      );

      await expect(service.getUserById('non-existent')).rejects.toThrow();
    });
  });

  describe('getAllUsers', () => {
    it('successful retrieval', async () => {
      const users: User[] = [
        {
          id: 'user-1',
          name: 'John',
          username: 'johndoe',
          email: 'john@example.com',
          password: 'hash',
          avatar: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'user-2',
          name: 'Jane',
          username: 'janesmith',
          email: 'jane@example.com',
          password: 'hash',
          avatar: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockUserRepo.findAll.mockResolvedValue(users);

      const result = await service.getAllUsers();

      expect(result).toHaveLength(2);
    });

    it('returns empty list', async () => {
      mockUserRepo.findAll.mockResolvedValue([]);

      const result = await service.getAllUsers();

      expect(result).toHaveLength(0);
    });

    it('propagates repository error', async () => {
      mockUserRepo.findAll.mockRejectedValue(new Error('database error'));

      await expect(service.getAllUsers()).rejects.toThrow('database error');
    });
  });

  describe('updateUser', () => {
    it('successful update', async () => {
      const id = 'test-user-id';
      const dto: UpdateUserDto = {
        name: 'Updated Name',
        username: 'updateduser',
        email: 'updated@example.com',
        password: 'newpassword123',
        belt_color: 'purple',
        belt_stripe: 3,
      };
      const existing: User = {
        id,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'oldhash',
        avatar: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedUser: User = {
        ...existing,
        name: dto.name,
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
      };
      mockUserRepo.findById.mockResolvedValue(existing);
      mockUserRepo.update.mockResolvedValue(updatedUser);
      mockBeltService.createBeltProgress.mockResolvedValue({} as never);

      const result = await service.updateUser(id, dto);

      expect(result.name).toBe(dto.name);
      expect(result.email).toBe(dto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(mockUserRepo.update).toHaveBeenCalled();
      expect(mockBeltService.createBeltProgress).toHaveBeenCalledWith({
        userId: updatedUser.id,
        color: dto.belt_color,
        stripes: dto.belt_stripe,
      });
    });

    it('propagates user not found', async () => {
      mockUserRepo.findById.mockRejectedValue(
        new Error('Failed to find user'),
      );

      await expect(
        service.updateUser('non-existent', {
          name: 'Updated',
          username: 'u',
          email: 'u@e.com',
          password: 'pass',
          belt_color: 'blue',
          belt_stripe: 0,
        }),
      ).rejects.toThrow();
    });

    it('propagates repository update error', async () => {
      const existing: User = {
        id: 'test-user-id',
        name: 'John',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'hash',
        avatar: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUserRepo.findById.mockResolvedValue(existing);
      mockUserRepo.update.mockRejectedValue(new Error('database update error'));

      await expect(
        service.updateUser('test-user-id', {
          name: 'Updated',
          username: 'u',
          email: 'u@e.com',
          password: 'pass',
          belt_color: 'blue',
          belt_stripe: 0,
        }),
      ).rejects.toThrow('database update error');
    });
  });
});
