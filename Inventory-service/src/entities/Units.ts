import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Regions } from "./Regions";
import { Employees } from "./foreign-entities/Employees";
import { unitTypes } from "../enums/unitTypes.enum";
import { Unit_Stocks } from "./Unit_Stocks";
import { Bills } from "./foreign-entities/Bills";

@Entity()
export class Units {
    @PrimaryGeneratedColumn()
    unit_id: number;

    @ManyToOne(() => Regions, region => region.region_id)
    @JoinColumn({name: 'region_id'})
    region: Regions;
    
    @OneToOne(() => Employees, employee => employee.employee_id)
    manager_id: Employees;

    @OneToMany(() => Employees, employee => employee.unit, {nullable: true})
    employees: Employees[] | null;

    @OneToMany(() => Unit_Stocks, unit_stock => unit_stock.unit, {nullable: true})
    unit_stocks: Unit_Stocks[] | null;

    @OneToMany(() => Bills, bill => bill.unit, {nullable: true})
    bills: Bills[] | null;    

    @Column()
    name: string;

    @Column({
        type : 'enum',
        enum: unitTypes,
        default: unitTypes.STORE
    })
    type: unitTypes;
}