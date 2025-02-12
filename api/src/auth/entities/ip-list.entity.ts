import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum IPListType {
  WHITELIST = 'whitelist',
  BLACKLIST = 'blacklist',
}

@Entity('ip_lists')
export class IPList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @Column({
    type: 'enum',
    enum: IPListType,
    default: IPListType.BLACKLIST
  })
  type: IPListType;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 