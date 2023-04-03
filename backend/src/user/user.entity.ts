import { Group } from 'src/group/group.entity';
import { Prediction } from 'src/prediction/prediction.entity';
import { Score } from 'src/score/score.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  password?: string;

  @OneToMany(() => Prediction, (prediction) => prediction.user, {
    nullable: true,
  })
  predictions?: Relation<Prediction[]>;

  @OneToMany(() => Score, (score) => score.user, {
    nullable: true,
  })
  scores?: Relation<Score[]>;

  @ManyToOne(() => Group, (group) => group.users, { nullable: true })
  group?: Relation<Group>;

  @Column({ nullable: true })
  groupId?: number;
}
