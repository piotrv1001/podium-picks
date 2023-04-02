import { Prediction } from 'src/prediction/prediction.entity';
import { Result } from 'src/result/result.entity';
import { Score } from 'src/score/score.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'race' })
export class Race {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  date?: Date;

  @Column({ nullable: true })
  country?: string;

  @OneToMany(() => Prediction, (prediction) => prediction.race, {
    nullable: true,
  })
  predictions?: Relation<Prediction[]>;

  @OneToMany(() => Result, (result) => result.race, {
    nullable: true,
  })
  results?: Relation<Result[]>;

  @OneToMany(() => Score, (score) => score.race, {
    nullable: true,
  })
  scores?: Relation<Score[]>;
}
