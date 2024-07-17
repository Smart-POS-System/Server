import "reflect-metadata";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToOne,
    OneToMany,
    JoinColumn,
  } from "typeorm";
  import { Roles } from "../enums/roles.enum";
  import { Regions } from "./foreign-entities/Regions";
  import { Units } from "./foreign-entities/Units";
  import { Bills } from "./foreign-entities/Bills";
  import { Unit_Stocks } from "./foreign-entities/Unit_Stocks";
  
  @Entity()
  export class Employees {
    @PrimaryGeneratedColumn()
    employee_id: number;
  
    @Column()
    name: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ default: "12345678" })
    password: string;
  
    // @Column({
        // type: "enum",
        // enum: Roles,
        // default: Roles.CASHIER,
    // })
    // role: Roles;

    // @OneToMany (() => Regions, (region) => region.manager_id, { nullable: true })
    // regions: Regions[] | null;

    // @OneToOne(() => Units, (unit : Units) => unit.manager_id, { nullable: true })
    // unit_managers: Units | null;

    // @ManyToOne(() => Regions, (region: Regions) => region.employees, { nullable: true })
    // @JoinColumn({ name: "region_id" })
    // region: Regions | null;

    // @ManyToOne(() => Units, (unit: Units) => unit.unit_id, { nullable: true })
    // @JoinColumn({ name: "unit_id" })
    // unit: Units | null;

    // @OneToMany(() => Bills, (bill: Bills) => bill.bill_id, { nullable: true })
    // bills: Bills[];

    // @OneToMany(() => Unit_Stocks, (unit_stock: Unit_Stocks) => unit_stock.stock_id, { nullable: true })
    // unit_stocks: Unit_Stocks[];
  
    @Column({ type: "boolean", default: true })
    is_active: boolean;
  
    @Column({ type: "boolean", default: true })
    temporary: boolean;
  
    @Column({ type: "timestamp", nullable: true })
    password_changed_at: Date | null;
  
    @Column({ type: "text", nullable: true })
    password_reset_token: string | null;
  
    @Column({ type: "timestamp", nullable: true })
    password_reset_expires: Date | null;
  }
  