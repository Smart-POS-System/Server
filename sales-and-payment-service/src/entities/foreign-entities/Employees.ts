import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToOne,
    OneToMany,
    JoinColumn,
  } from "typeorm";
import { Bills } from "../Bills";
  
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

    @Column()
    region_id: number | null;

    @Column()
    unit_id: number | null;

    @OneToMany(() => Bills, (bill: Bills) => bill.bill_id, { nullable: true })
    bills: Bills[];
  
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
  