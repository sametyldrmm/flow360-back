import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: false})
  formState: boolean; // boolda olabil

  @Column({default: "0"})
  voteState: string;

  @Column({default: false})
  priceState: boolean;

  @OneToOne(() => User, user => user.state)
  @JoinColumn()
  user: User;
} 