import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Client } from './client.entity';
import { Match } from './match.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.projects)
  client: Client;

  @Column()
  country: string;

  @Column('json')
  services_needed: string[];

  @Column()
  budget: number;

  @Column()
  status: string;

  @OneToMany(() => Match, (match) => match.project)
  matches: Match[];
}