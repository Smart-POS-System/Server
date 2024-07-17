import "reflect-metadata";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employees } from "../Employees";

@Entity()
export class Regions {
    @PrimaryGeneratedColumn()
    region_id: number;

    @Column()
    name: string;

    // @Column()
    @OneToOne(() => Employees, (employee: Employees) => employee.employee_id)
    manager_id: Employees;

    @OneToMany(() => Employees, employee => employee.region)
    employees: Employees[];
}