import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./Employee";
import { Location } from "./Location";
import { Item } from "./Item";
import { Stock } from "./Stock";
import { Inventory_Transactions } from "../enums/inventoryTransactions.enum";

@Entity()
export class Stock_Log {
  @PrimaryGeneratedColumn()
  log_id: number;

  @ManyToOne(() => Stock, (stock) => stock.logs)
  @JoinColumn({ name: "stock_id" })
  stock: Stock;
  // @Column()
  // stock_id: number;

  @Column({ type: "decimal", precision: 6, scale: 3 })
  quantity: number;

  @Column({
    type: "enum",
    enum: Inventory_Transactions,
  })
  type: Inventory_Transactions;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  log_time: Date;
}
