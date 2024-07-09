import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Inventory } from "./Inventory";
import { Employee } from "./Employee";

@Entity()
export class InventorySupervisor {
  @PrimaryGeneratedColumn()
  supervisor_id: number;

  @ManyToOne(() => Inventory)
  @JoinColumn({ name: "inventory_id" })
  inventory: Inventory;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: "employee_id" })
  employee: Employee;
}
