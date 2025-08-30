import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export type UserRole = 'client' | 'admin';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['client', 'admin'], default: 'client' })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;
}
