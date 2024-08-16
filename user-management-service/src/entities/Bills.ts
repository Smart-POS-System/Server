import "reflect-metadata";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employees } from "./Employees";
import { Customers } from "./Customers";
import { Payment_Methods } from "../enums/bills.enum";
import { Units } from "./Units";
import { Product_Variants } from "./Product_Variants";

@Entity()
export class Bills {
    @PrimaryGeneratedColumn()
    bill_id: number;
    
    @Column({ type: 'float', precision: 3, scale: 1, default: 0.0 })
    discount: number;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    timestamp: Date;

    @Column({
        type: "enum",
        enum: Payment_Methods,
        default: Payment_Methods.CASH,
    })
    role: Payment_Methods;

    @Column()
    status: string;

    @ManyToOne(() => Employees, employee => employee.bills)
    employee: Employees;

    @ManyToOne(() => Units, unit => unit.bills)
    unit: Units;

    @ManyToOne(() => Customers, customer => customer.bills, { nullable: true })
    customer: Customers | null;

    @ManyToMany(() => Product_Variants, variant => variant.bill)
    variant: Product_Variants[];

}