import "reflect-metadata";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employees } from "../Employees";

@Entity()
export class Units {
    @PrimaryGeneratedColumn()
    unit_id: number;

    @Column()
    region_id: number;

    @Column()
    name: string;

    @Column()
    type: string;

    @OneToOne(() => Employees, (employee: Employees) => employee.employee_id)
    manager_id: Employees;

    @OneToMany(() => Employees, employee => employee.employee_id)
    employees: Employees[];
}