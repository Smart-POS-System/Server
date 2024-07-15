import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { UserRole } from "../enums/role.enum";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  employee_id: number;

  @Column()
  employee_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: "12345678" })
  password: string;

  @Column({ type: "enum", enum: UserRole })
  role: string;

  @Column({ type: "boolean", nullable: true })
  is_active: boolean | null;

  @Column({ type: "boolean", nullable: true })
  temporary: boolean | null;

  @Column({ type: "timestamp", nullable: true })
  password_changed_at: Date | null;

  @Column({ type: "text", nullable: true })
  password_reset_token: string | null;

  @Column({ type: "timestamp", nullable: true })
  password_reset_expires: Date | null;
}
