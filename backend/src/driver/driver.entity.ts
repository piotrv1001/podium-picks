import { Prediction } from 'src/prediction/prediction.entity';
import { Result } from 'src/result/result.entity';
import { Team } from 'src/team/team.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'driver' })
export class Driver {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  name?: string;

  @ManyToOne(() => Team, (team) => team.drivers, { nullable: true })
  team?: Relation<Team>;

  @OneToMany(() => Prediction, (prediction) => prediction.driver, {
    nullable: true,
  })
  predictions?: Relation<Prediction[]>;

  @OneToMany(() => Result, (result) => result.driver, {
    nullable: true,
  })
  results?: Relation<Result[]>;
}
