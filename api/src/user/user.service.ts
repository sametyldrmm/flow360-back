import { Injectable, NotFoundException, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { StateService } from '../state/state.service';
import { MailService } from '../mail/mail.service';
import { State } from '../state/entities/state.entity';
import { PasswordResetCode } from './entities/password-reset.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    private readonly stateService: StateService,
    private readonly mailService: MailService,
    @InjectRepository(PasswordResetCode)
    private readonly passwordResetCodeRepository: Repository<PasswordResetCode>,
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
    // ID'nin geçerli bir sayı olduğundan emin ol
    if (isNaN(id) || !Number.isInteger(+id)) {
      throw new BadRequestException('Geçersiz ID formatı');
    }

    // Önce kullanıcıyı state ilişkisiyle birlikte bul
    const user = await this.userRepository.findOne({
      where: { id: +id }, // ID'yi number'a çevir
      relations: ['state']
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Eğer state varsa önce onu sil
    if (user.state) {
      await this.stateRepository.remove(user.state);
    }

    // Sonra kullanıcıyı sil
    await this.userRepository.remove(user);
  }

  /*
  async findByNickname(nickname: string): Promise<User> {
    return this.UserRepository.findOne({ where: { username: nickname } });
  }
  */

  async requestPasswordReset(email: string) {
    return this.mailService.sendPasswordResetCode(email);
  }

  async verifyPasswordResetCode(email: string, code: string) {
    await this.mailService.verifyPasswordResetCode(email, code);
  }

  async updatePassword(email: string, password: string): Promise<{ ok: boolean }> {
    const user = await this.findByEmail(email);
    console.log(user);
    user.password = password;
    await this.userRepository.save(user);
    return { ok: true };
  }

  @Cron('0 */3 * * * *') // Her 3 dakikada bir çalışır
  async cleanupExpiredResetCodes() {
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
    
    await this.passwordResetCodeRepository
      .createQueryBuilder()
      .delete()
      .where('createdAt < :threeMinutesAgo', { threeMinutesAgo })
      .execute();
  }

  async removeAll() {
    try {
      // Tüm kullanıcıları state ilişkileriyle birlikte al
      const users = await this.userRepository.find({
        relations: ['state']
      });

      // Önce state'i olan kullanıcıların state'lerini sil
      for (const user of users) {
        try {
          if (user.state) {
            await this.stateRepository.remove(user.state);
          }
        } catch (error) {
          console.log(`State silinirken hata: User ID ${user.id}`, error.message);
          continue; // Hata olsa bile diğer kullanıcılara devam et
        }
      }

      // Sonra tüm kullanıcıları sil
      for (const user of users) {
        try {
          await this.userRepository.remove(user);
        } catch (error) {
          console.log(`Kullanıcı silinirken hata: User ID ${user.id}`, error.message);
          continue; // Hata olsa bile diğer kullanıcılara devam et
        }
      }

      return { success: true, message: 'Tüm kullanıcılar ve ilgili state\'ler silindi' };
    } catch (error) {
      console.log('Toplu silme işleminde hata:', error.message);
      throw new InternalServerErrorException('Silme işlemi sırasında bir hata oluştu');
    }
  }
}

/*
  
*/