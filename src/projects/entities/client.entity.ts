import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_name: string;

  @Column()
  contact_email: string;

  @OneToMany(() => Project, (project) => project.client)
  projects: Project[];
}