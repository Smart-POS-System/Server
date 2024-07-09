import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Inventory } from "./Inventory";
import { Item } from "./Item";
import { Employee } from "./Employee";
import { InventorySupervisor } from "./InventorySupervisor";

@Entity()
export class InventoryStock {
  @PrimaryGeneratedColumn()
  stock_id: number;

  @ManyToOne(() => Inventory)
  @JoinColumn({ name: "inventory_id" })
  inventory: Inventory;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  quantity: number;

  @Column()
  unit_price: number;

  @ManyToOne(() => InventorySupervisor)
  @JoinColumn({ name: "supervisor_id" })
  supervisor: InventorySupervisor;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: "manager_id" })
  manager: Employee;
}
