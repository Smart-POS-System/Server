import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./Employee";
import { Customer } from "./Customer";
import { Location } from "./Location";
import { Item } from "./Item";
import { Bill_Status, Payment_Methods } from "../enums/bills.enum";

@Entity()
export class Bill {
  @PrimaryGeneratedColumn()
  bill_id: number;

  @Column({
    type: "numeric",
    precision: 3,
    scale: 1,
    default: 0.0,
    nullable: true,
  })
  discount: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  timestamp: Date;

  @Column({
    type: "enum",
    enum: Payment_Methods,
    default: Payment_Methods.CASH,
  })
  payment_method: Payment_Methods;

  @Column({
    type: "enum",
    enum: Bill_Status,
    default: Bill_Status.PENDING,
  })
  status: Bill_Status;

  @ManyToOne(() => Employee, (employee) => employee.bills)
  @JoinColumn({ name: "cashier_id" })
  employee: Employee;

  @ManyToOne(() => Location, (location) => location.bills)
  @JoinColumn({ name: "store_id" })
  store: Location;

  @ManyToOne(() => Customer, (customer) => customer.bills)
  @JoinColumn({ name: "customer_id" })
  customer: Customer | null;

  @Column("jsonb")
  items: any;
}
