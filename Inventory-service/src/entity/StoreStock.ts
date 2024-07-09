import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Store } from "./Store";
import { Item } from "./Item";
import { StoreSupervisor } from "./StoreSupervisor";
import { Employee } from "./Employee";

@Entity()
export class StoreStock {
  @PrimaryGeneratedColumn()
  stock_id: number;

  @ManyToOne(() => Store)
  @JoinColumn({ name: "store_id" })
  store: Store;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  quantity: number;

  @ManyToOne(() => StoreSupervisor)
  @JoinColumn({ name: "supervisor_id" })
  supervisor: StoreSupervisor;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: "manager_id" })
  manager: Employee;
}
