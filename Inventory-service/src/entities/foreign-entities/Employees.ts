import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToOne,
    OneToMany,
    JoinColumn,
  } from "typeorm";
  import { Regions } from "../Regions";
  import { Units } from "../Units";
  import { Unit_Stocks } from "../Unit_Stocks";
  
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
  
    @Column()
    role: string;

    @OneToMany (() => Regions, (region: Regions) => region.manager, { nullable: true })
    regions: Regions[] | null;

    @OneToOne(() => Units, (unit : Units) => unit.manager_id, { nullable: true })
    unit_managers: Units | null;

    @ManyToOne(() => Regions, (region: Regions) => region.region_id, { nullable: true })
    @JoinColumn({ name: "region_id" })
    region: Regions | null;

    @ManyToOne(() => Units, (unit: Units) => unit.unit_id, { nullable: true })
    @JoinColumn({ name: "unit_id" })
    unit: Units | null;

    @Column()
    bill_id: number;

    @OneToMany(() => Unit_Stocks, (unit_stock: Unit_Stocks) => unit_stock.stock_id, { nullable: true })
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
  