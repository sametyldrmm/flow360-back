import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from './entities/state.entity';
import { UpdateStateDto } from './dto/update-state.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(State)
    private stateRepository: Repository<State>,
  ) {}

  private temporaryPasswords: Map<string, { code: string; timestamp: number }> = new Map();

  async create(userId: number): Promise<State> {
    const state = this.stateRepository.create({
      formState: false,
      voteState: '0',
      priceState: false,
      user: { id: userId }
    });
    return this.stateRepository.save(state);
  }

  async findByUserId(userId: number): Promise<State> {
    return this.stateRepository.findOne({ where: { user: { id: userId } } });
  }

  async update(userId: number, updateStateDto: UpdateStateDto) {
    const state = await this.stateRepository.findOne({
      where: { user: { id: userId } }
    });

    if (!state) {
      throw new NotFoundException('State bulunamadı');
    }

    const updatedState = Object.assign(state, updateStateDto);
    return await this.stateRepository.save(updatedState);
  }

  saveTemporaryPassword(email: string, code: string) {
    this.temporaryPasswords.set(email, {
      code,
      timestamp: Date.now(),
    });
  }

  verifyTemporaryPassword(email: string, code: string): boolean {
    const data = this.temporaryPasswords.get(email);
    if (!data) return false;

    // 5 dakika geçerlilik süresi
    const isValid = 
      data.code === code && 
      Date.now() - data.timestamp <= 5 * 60 * 1000;

    if (isValid) {
      this.temporaryPasswords.delete(email);
    }

    return isValid;
  }

  async updateFormState(userId: number, formState: boolean) {
    return await this.stateRepository.update(
      { user:  { id: userId } },
      { formState }
    );
  }

  async removeAll() {
    return await this.stateRepository.delete({});
  }

  async updateFavori(userId: number, favori: boolean) {
    const state = await this.stateRepository.findOne({ where: { user: { id: userId } } });
    if (!state) {
      throw new NotFoundException('State bulunamadı');
    }
    state.favori = favori;
    return this.stateRepository.save(state);
  }
} 