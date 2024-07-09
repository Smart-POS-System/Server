import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from "typeorm";
import { Bill } from "../entity/Bill";
import { Item } from "../entity/Item";

@Entity()
export class BillItem {
  @PrimaryGeneratedColumn()
  bill_item_id: number;

  @ManyToOne(() => Bill)
  @JoinColumn({ name: "bill_id" })
  bill: Bill;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  quantity: number;

  @Column({ default: 0 })
  discount: number;
}
