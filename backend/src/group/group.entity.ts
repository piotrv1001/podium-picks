import { Prediction } from 'src/prediction/prediction.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'group' })
export class Group {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  code?: string;

  @OneToMany(() => Prediction, (prediction) => prediction.group, {
    nullable: true,
  })
  predictions?: Relation<Prediction[]>;

  @ManyToMany(() => User, (user) => user.groups, {
    nullable: true,
    cascade: true,
  })
  @JoinTable()
  users?: Relation<User[]>;
}
