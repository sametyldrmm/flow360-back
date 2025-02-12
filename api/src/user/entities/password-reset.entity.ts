import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('password_reset_codes')
export class PasswordResetCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ length: 6 })
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isUsed: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
} 