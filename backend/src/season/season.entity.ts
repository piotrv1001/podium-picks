import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('season')
export class Season {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  name?: string;
}
