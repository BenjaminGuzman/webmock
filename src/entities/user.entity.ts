import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
} from "typeorm";

@Entity()
@Unique(["email"])
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  firstName: string;

  @Column("varchar")
  lastName: string;

  @Column("varchar")
  username: string;

  @Column("varchar")
  email: string;

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
