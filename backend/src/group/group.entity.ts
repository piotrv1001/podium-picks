import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
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

  @OneToMany(() => User, (user) => user.group, { nullable: true })
  users?: Relation<User[]>;
}
