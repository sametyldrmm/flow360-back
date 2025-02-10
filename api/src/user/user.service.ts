import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { StateService } from '../state/state.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly stateService: StateService,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { nickname: createUserDto.nickname },
        { tc: createUserDto.tc },
        { tel: createUserDto.tel }
      ]
    });

    if (existingUser) {
      throw new Error('Bu email, kullanıcı adı veya TC kimlik numarası zaten kullanımda');
    }

    const user = this.userRepository.create(createUserDto);

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['state']
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['state']
    });

    if (!user) {
      throw new NotFoundException(`${id} ID'li kullanıcı bulunamadı`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['state']
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Eğer email, nickname veya tc güncellenmek isteniyorsa benzersizlik kontrolü yap
    if (updateUserDto.email || updateUserDto.nickname || updateUserDto.tc) {
      const existingUser = await this.userRepository.findOne({
        where: [
          { email: updateUserDto.email },
          { nickname: updateUserDto.nickname },
          { tc: updateUserDto.tc }
        ]
      });

      if (existingUser && existingUser.id !== id) {
        throw new Error('Bu email, kullanıcı adı veya TC kimlik numarası başka bir kullanıcı tarafından kullanılıyor');
      }
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  /*
  async findByNickname(nickname: string): Promise<User> {
    return this.UserRepository.findOne({ where: { username: nickname } });
  }
  */

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.findByEmail(email);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    this.stateService.saveTemporaryPassword(email, code);
    const sent = await this.mailService.sendPasswordResetCode(email, code);
    
    if (!sent) {
      throw new Error('Email gönderilemedi');
    }
  }

  async verifyPasswordResetCode(email: string, code: string): Promise<boolean> {
    const isValid = this.stateService.verifyTemporaryPassword(email, code);
    if (!isValid) {
      throw new UnauthorizedException('Geçersiz veya süresi dolmuş kod');
    }
    return true;
  }
}

/*
  
*/