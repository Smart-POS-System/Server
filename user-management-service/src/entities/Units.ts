import "reflect-metadata";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employees } from "./Employees";
import { Types } from "../enums/units.enums";
import { Regions } from "./Regions";
import { Unit_Stocks } from "./Unit_Stocks";
import { Bills } from "./Bills";

@Entity()
export class Units {
    @PrimaryGeneratedColumn()
    unit_id: number;

    @Column()
    name: string;

    @Column({
        type: "enum",
        enum: Types,
        default: Types.STORE,
    })
    type: Types;

    @OneToOne(() => Employees, employee => employee.units, { nullable: true })
    employee: Employees | null;

    @ManyToOne(() => Regions, region => region.units)
    region: Regions;

    @OneToMany(() => Employees, employee => employee.employee_id)
    employees: Employees[];

    @OneToMany(() => Unit_Stocks, unit_stocks => unit_stocks.unit, { nullable: true })
    unit_stocks: Unit_Stocks[] | null;

    @OneToMany(() => Bills, bill => bill.region, { nullable: true })
    bills: Bills[] | null;
}