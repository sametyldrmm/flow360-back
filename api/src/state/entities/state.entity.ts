import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  formState: boolean; // boolda olabil

  @Column()
  voteState: string;

  @Column()
  priceState: boolean;

  @OneToOne(() => User, user => user.state)
  @JoinColumn()
  user: User;
} 