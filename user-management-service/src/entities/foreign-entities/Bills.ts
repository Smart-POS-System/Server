import "reflect-metadata";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employees } from "../Employees";
import { Customers } from "../Customers";

@Entity()
export class Bills {
    @PrimaryGeneratedColumn()
    bill_id: number;

    @ManyToOne(() => Employees, employee => employee.employee_id)
    @JoinColumn({ name: 'cashier_id' })
    employee: Employees;

    @Column()
    unit_id: number;

    @ManyToOne(() => Customers, customer => customer.mobile_number, { nullable: true })
    @JoinColumn({ name: 'customer_id' })
    customer: Customers;

    @Column( { type: 'json'})
    bill_items: JSON;

    @Column({ type: 'float', precision: 3, scale: 1, default: 0.0 })
    discount: number;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    timestamp: Date;

    @Column()
    payment_method: string;

    @Column()
    status: string;

}