import "reflect-metadata";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./Employee";
import { Location } from "./Location";

@Entity()
export class Region {
    @PrimaryGeneratedColumn()
    region_id: number;

    @Column()
    name: string;

    @OneToOne(() => Employee, employee => employee.region)
    @JoinColumn({name: 'manager_id'})
    employee: Employee;

    // @OneToMany(() => Employees, employee => employee.region, { nullable: true })
    // employees: Employees[] | null;

    @OneToMany(() => Location, location => location.region, { nullable: true })
    locations: Location[];
}