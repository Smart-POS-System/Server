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
  import { Regions } from "./Regions";
  import { Units } from "./Units";
  import { Bills } from "./Bills";
  import { Unit_Stocks } from "./Unit_Stocks";
  
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
  
    @Column({
        type: "enum",
        enum: Roles,
        default: Roles.CASHIER,
    })
    role: Roles;

    @OneToOne (() => Regions, region => region.employee, { nullable: true })
    @JoinColumn()
    regions: Regions | null; //regionamanager relationship

    @OneToOne(() => Units, unit => unit.employee, { nullable: true })
    @JoinColumn()
    units: Units | null; //unitmanager relationship

    @ManyToOne(() => Regions, region => region.employees, { nullable: true })
    region: Regions | null;

    @ManyToOne(() => Units, unit => unit.employees, { nullable: true })
    unit: Units | null;

    @OneToMany(() => Bills, bill => bill.employee, { nullable: true })
    bills: Bills[];

    @OneToMany(() => Unit_Stocks, unit_stock => unit_stock.employee, { nullable: true })
    unit_stocks: Unit_Stocks[];
  
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
  