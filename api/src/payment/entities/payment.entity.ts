import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed'
}
// default değerler
@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  merchantOid: string;

  @Column()
  email: string;

  @Column('decimal', { precision: 10, scale: 2 , default: 499})
  amount: number; // 499

  @Column({ default: 'TRY' })
  currency: string; // TRY

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  errorMessage?: string;

  @Column('json', { nullable: true , default: '[{"id":"1","name":"test","price":"499","quantity":"1"}]'})
  basketItems: string; // [{"id":"1","name":"test","price":"499","quantity":"1"}]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 