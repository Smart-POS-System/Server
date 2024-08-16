import "reflect-metadata";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employees } from "./Employees";
import { Units } from "./Units";

@Entity()
export class Regions {
    @PrimaryGeneratedColumn()
    region_id: number;

    @Column()
    name: string;

    @OneToOne(() => Employees, employee => employee.regions)
    employee: Employees;

    @OneToMany(() => Employees, employee => employee.region, { nullable: true })
    employees: Employees[] | null;

    @OneToMany(() => Units, unit => unit.region, { nullable: true })
    units: Units[] | null;
}