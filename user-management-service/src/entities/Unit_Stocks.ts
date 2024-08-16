import "reflect-metadata";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employees } from "./Employees";
import { Units } from "./Units";
import { Product_Variants } from "./Product_Variants";

@Entity()
export class Unit_Stocks {
    @PrimaryGeneratedColumn()
    stock_id: number;

    @Column({type: 'decimal', precision: 6, scale: 3})
    quantity: number;

    @ManyToOne(() => Units, unit => unit.unit_stocks)
    unit: Units;

    @ManyToOne(() => Employees, employee => employee.unit_stocks)
    employee: Employees;

    @ManyToOne(() => Product_Variants, variant => variant.unit_stocks)
    variant: Product_Variants;
}