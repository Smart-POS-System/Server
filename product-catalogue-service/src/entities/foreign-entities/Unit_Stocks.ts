import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product_Variants } from "../Product_Variants";

@Entity()
export class Unit_Stocks {
    @PrimaryGeneratedColumn()
    stock_id: number;

    @ManyToOne(() => Product_Variants, product_variant => product_variant.variant_id)
    @JoinColumn({ name: 'variant_id' })
    variant: Product_Variants;

    @Column({type: 'decimal', precision: 6, scale: 3})
    quantity: number;

    @Column()
    unit_id: number;

    @Column()
    manager_id: number;
}