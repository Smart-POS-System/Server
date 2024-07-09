import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { StoreCashier } from "./StoreCashier";
import { Customer } from "./Customer";
import { Store } from "./Store";
import { BillItem } from "./BillItem";

@Entity()
export class Bill {
  @PrimaryGeneratedColumn()
  bill_id: number;

  @ManyToOne(() => StoreCashier)
  @JoinColumn({ name: "cashier_id" })
  cashier: StoreCashier;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id" })
  store: Store;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @Column({ default: 0 })
  discount: number;

  @CreateDateColumn()
  timestamp: Date;

  @Column()
  payment_method: string;

  @Column()
  status: string;
}
