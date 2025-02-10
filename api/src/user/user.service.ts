import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
    ) {}

  async create(createUserDto: CreateUserDto) {
    var user = await this.UserRepository.create(createUserDto);
    return this.UserRepository.save(user);
  }

  async findAll() {
    return await this.UserRepository.find({relations: ['cards']});
  }

  async findOne(id: number) {
    return await this.UserRepository.findOne({where: {id: id}});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    //cascade: true
    return  await this.UserRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.UserRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
//    this.cardService.removeByUser(id);    
    await this.UserRepository.remove(user);
  }

  async findByNickname(nickname: string): Promise<User> {
    return this.UserRepository.findOne({ where: { username: nickname } });
  }
}
