import "reflect-metadata";
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Bill } from "./Bill";

@Entity()
export class Customer {
  @PrimaryColumn()
  mobile: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @CreateDateColumn({ type: "timestamp" })
  registered_date: Date;

  @Column({
    type: "int",
    default: 0,
  })
  loyalty_points: number;

  @OneToMany(() => Bill, (bill) => bill.customer)
  bills: Bill[];
}
