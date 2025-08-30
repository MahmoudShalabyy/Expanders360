import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';
import { Vendor } from './vendor.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.matches)
  project: Project;

  @ManyToOne(() => Vendor, (vendor) => vendor.matches)
  vendor: Vendor;

  @Column()
  score: number;

  @Column()
  created_at: Date;
}