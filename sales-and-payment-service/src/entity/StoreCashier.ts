import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Store } from "./Store";
import { Employee } from "./Employee";

@Entity()
export class StoreCashier {
  @PrimaryGeneratedColumn()
  cashier_id: number;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id" })
  store: Store;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: "employee_id" })
  employee: Employee;
}