import { Prediction } from 'src/prediction/prediction.entity';
import { Result } from 'src/result/result.entity';
import { Score } from 'src/score/score.entity';
import { Season } from 'src/season/season.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'race' })
export class Race {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true, type: 'datetime' })
  date?: Date;

  @Column({ nullable: true, type: 'datetime' })
  predictionDeadline?: Date;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  countryCode?: string;

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

  @ManyToOne(() => Season, (season) => season.races)
  season?: Relation<Season>;

  @Column({ nullable: true })
  seasonId?: number;
}
