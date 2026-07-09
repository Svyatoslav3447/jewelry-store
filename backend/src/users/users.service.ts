import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }
  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }


  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { phone } });
  }

  async createUser(phone: string, password: string, firstName?: string, lastName?: string): Promise<User> {
    const user = this.usersRepository.create({
      phone,
      password,
      role: 'USER',
      firstName,
      lastName,
    });
    return this.usersRepository.save(user);
  }
  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}