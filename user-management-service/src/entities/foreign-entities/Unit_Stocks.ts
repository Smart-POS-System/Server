import "reflect-metadata";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employees } from "../Employees";

@Entity()
export class Unit_Stocks {
    @PrimaryGeneratedColumn()
    stock_id: number;

    @Column()
    variant: number;

    @Column({type: 'decimal', precision: 6, scale: 3})
    quantity: number;

    @Column()
    unit_id: number;

    @ManyToOne(() => Employees, employee => employee.employee_id)
    @JoinColumn({ name: 'manager_id' })
    employee: Employees;
}