import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Region } from "./Region";
import { Employee } from "./Employee";

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  store_id: number;

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region: Region;

  @Column()
  name: string;

  @Column()
  location: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: "manager_id" })
  manager: Employee;
}
