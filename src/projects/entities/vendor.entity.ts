import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Match } from './match.entity';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('json')
  countries_supported: string[];

  @Column('json')
  services_offered: string[];

  @Column()
  rating: number;

  @Column()
  response_sla_hours: number;

  @OneToMany(() => Match, (match) => match.vendor)
  matches: Match[];
}