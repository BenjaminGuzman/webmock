import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column("varchar")
  firstName: string;

  @Column("varchar")
  lastName: string;

  @Column("varchar")
  username: string;

  /**
   * Password hash
   */
  @Column("varchar")
  password: string;

  /**
   * date of birth in UTC-00:00
   */
  @Column("date")
  dob: Date;

  @CreateDateColumn()
  registeredAt: Date;
}
