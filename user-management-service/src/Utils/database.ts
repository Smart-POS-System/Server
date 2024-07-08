import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  role: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column("timestamp with time zone", { nullable: true })
  passwordChangedAt: Date | null;

  @Column({ type: "text", nullable: true })
  passwordResetToken: string | null;

  @Column("timestamp with time zone", { nullable: true })
  passwordResetExpires: Date | null;
}
