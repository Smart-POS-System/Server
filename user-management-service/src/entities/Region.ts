import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./Employee";
import { Location } from "./Location";

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  region_id: number;

  @Column()
  name: string;

  @ManyToOne(() => Employee, (employee) => employee.regions)
  @JoinColumn({ name: "manager_id" })
  employee: Employee;

  @OneToMany(() => Location, (location) => location.region, { nullable: true })
  locations: Location[];
}
