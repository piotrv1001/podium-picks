import { Race } from 'src/race/race.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'score' })
export class Score {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  points?: number;

  @ManyToOne(() => User, (user) => user.scores, { nullable: true })
  user?: Relation<User>;

  @ManyToOne(() => Race, (race) => race.scores, { nullable: true })
  race?: Relation<Race>;

  @Column({ nullable: true })
  userId?: number;

  @Column({ nullable: true })
  raceId?: number;
}
