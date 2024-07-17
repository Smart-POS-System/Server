import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employees } from "./foreign-entities/Employees";
import { Units } from "./Units";

@Entity()
export class Regions {
    @PrimaryGeneratedColumn()
    region_id: number;

    @Column()
    name: string;

    @ManyToOne(() => Employees, employee => employee.employee_id, {nullable: true})
    @JoinColumn({name: 'manager_id'})
    manager: Employees;

    @OneToMany(() => Employees, employee => employee.region, {nullable: true})
    employees: Employees[];

    @OneToMany(() => Units, unit => unit.region, {nullable: true})
    units: Units[];
}