import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Region } from "./Region";
import { Location } from "./Location";
import { Bill } from "./Bill";
import { Stock } from "./Stock";
import { Roles } from "../enums/roles.enum";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  employee_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: "12345678" })
  password: string;

  @Column({
    type: "enum",
    enum: Roles,
    default: Roles.CASHIER,
  })
  role: Roles;

  @OneToOne(() => Region, (region) => region.employee)
  region: Region; //regionamanager relationship

  @ManyToOne(() => Location, (location) => location.employees, {
    nullable: true,
  })
  @JoinColumn({ name: "location_id" })
  location: Location | null;

  @OneToMany(() => Bill, (bill) => bill.employee, { nullable: true })
  bills: Bill[];

  @OneToMany(() => Stock, (stock) => stock.employee, { nullable: true })
  stocks: Stock[];

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "boolean", default: true })
  temporary: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  account_created_at: Date;

  @Column({ type: "timestamp", nullable: true })
  last_login_at: Date | null;

  @Column({ type: "timestamp", nullable: true })
  password_changed_at: Date | null;

  @Column({ type: "text", nullable: true })
  password_reset_token: string | null;

  @Column({ type: "timestamp", nullable: true })
  password_reset_expires: Date | null;
}
