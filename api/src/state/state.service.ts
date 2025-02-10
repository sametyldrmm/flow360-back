import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from './entities/state.entity';

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
      voteState: 'pending',
      priceState: false,
      user: { id: userId }
    });
    return this.stateRepository.save(state);
  }

  async findByUserId(userId: number): Promise<State> {
    return this.stateRepository.findOne({ where: { user: { id: userId } } });
  }

  async update(id: number, updateData: Partial<State>): Promise<State> {
    await this.stateRepository.update(id, updateData);
    return this.stateRepository.findOne({ where: { id } });
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
} 
