import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Employee } from "./Employee";

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  region_id: number;

  @Column()
  name: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: "manager_id" })
  manager: Employee;
}
