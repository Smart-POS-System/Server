import "reflect-metadata";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./Employee";
import { Region } from "./Region";
import { Stock } from "./Stock";
import { Bill } from "./Bill";
import { Types } from "../enums/units.enum";

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  location_id: number;

  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: Types,
    default: Types.STORE,
  })
  type: Types;

  @OneToOne(() => Employee, (employee) => employee.location, { nullable: true })
  manager: Employee | null;

  @ManyToOne(() => Region, (region) => region.locations)
  @JoinColumn({ name: "region_id" })
  region: Region;

  @OneToMany(() => Employee, (employee) => employee.location)
  employees: Employee[];

  @OneToMany(() => Stock, (stock) => stock.location, { nullable: true })
  stocks: Stock[];

  @OneToMany(() => Bill, (bill) => bill.store, { nullable: true })
  bills: Bill[];
}
