import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employees } from "./foreign-entities/Employees";
import { Customers } from "./foreign-entities/Customers";
import { Units } from "./foreign-entities/Units";
import { PaymentMethods } from "../enums/paymentMethods.enum";
import { Status } from "../enums/status.enum";

@Entity()
export class Bills {
    @PrimaryGeneratedColumn()
    bill_id: number;

    @ManyToOne(() => Employees, employee => employee.employee_id)
    @JoinColumn({ name: 'cashier_id' })
    employee: Employees;

    @ManyToOne(() => Units, unit => unit.unit_id)
    @JoinColumn({ name: 'store_id' })
    unit: Units;

    @ManyToOne(() => Customers, customer => customer.mobile_number, { nullable: true })
    @JoinColumn({ name: 'customer_id' })
    customer: Customers;

    @Column( { type: 'json'})
    bill_items: JSON;

    @Column({ type: 'float', precision: 3, scale: 1, default: 0.0 })
    discount: number;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    timestamp: Date;

    @Column({
        type: 'enum',
        enum: PaymentMethods,
        default: PaymentMethods.CASH
    })
    payment_method: PaymentMethods;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.PENDING
    })
    status: Status;

}