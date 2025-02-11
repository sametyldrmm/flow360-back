import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { StateService } from '../state/state.service';
import { MailService } from '../mail/mail.service';
import { State } from '../state/entities/state.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
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
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Kullanıcı bilgilerini güncelle
    Object.assign(user, updateUserDto);
    
    // Tüm gerekli alanların dolu olup olmadığını kontrol et
    const isProfileComplete = this.checkProfileCompletion(user);
    
    // State'i kontrol et, yoksa oluştur
    const existingState = await this.stateService.findByUserId(id);
    if (!existingState && isProfileComplete) {
      await this.stateService.create(id);
    }
    
    // State tablosundaki formState'i güncelle
    await this.stateService.updateFormState(id, isProfileComplete);

    return await this.userRepository.save(user);
  }

  private checkProfileCompletion(user: User): boolean {
    // Burada kontrol edilmesi gereken tüm alanları kontrol edin
    return !!(
      user.name &&
      user.surname &&
      user.email &&
      user.tel &&
      user.tc &&
      user.birthDate &&
      user.city &&
      user.kvkk &&
      user.socialMedia &&
      user.youtube
    );
  }

  async remove(id: number) {
    await this.stateRepository.delete({ user: { id } });
    await this.userRepository.delete(id);
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
    console.log(email,code);
    const isValid = this.stateService.verifyTemporaryPassword(email, code);
    console.log(isValid);
    if (!isValid) {
      throw new UnauthorizedException('Geçersiz veya süresi dolmuş kod');
    }
    return true;
  }

  async updatePassword(email: string, password: string): Promise<{ ok: boolean }> {
    const user = await this.findByEmail(email);
    console.log(user);
    user.password = password;
    await this.userRepository.save(user);
    return { ok: true };
  }
}

/*
  
*/