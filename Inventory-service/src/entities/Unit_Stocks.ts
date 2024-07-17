import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Units } from "./Units";
// import { Product_Variants } from "./foreign-entities/Product_Variants";
import { Product_Variants } from "./foreign-entities/Product_Variants";

import { Employees } from "./foreign-entities/Employees";

@Entity()
export class Unit_Stocks {
    @PrimaryGeneratedColumn()
    stock_id: number;

    @ManyToOne(() => Product_Variants, product_variant => product_variant.variant_id)
    @JoinColumn({ name: 'variant_id' })
    variant: Product_Variants;

    @Column({type: 'decimal', precision: 6, scale: 3})
    quantity: number;

    @ManyToOne(() => Units, unit => unit.unit_id)
    @JoinColumn({ name: 'unit_id' })
    unit: Units;

    @ManyToOne(() => Employees, employee => employee.employee_id)
    @JoinColumn({ name: 'manager_id' })
    manager: Employees;
}