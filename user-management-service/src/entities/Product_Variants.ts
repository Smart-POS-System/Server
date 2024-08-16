import {Column, Entity, JoinColumn, ManyToOne, OneToMany, ManyToMany, PrimaryGeneratedColumn, JoinTable} from 'typeorm';
import { Products } from './Products';
import { Unit_Stocks } from './Unit_Stocks';
import { Bills } from './Bills';

@Entity()
export class Product_Variants {
    @PrimaryGeneratedColumn()
    variant_id: number;

    @ManyToOne(() => Products, product => product.variants)
    product: Products;

    @OneToMany(() => Unit_Stocks, unit_stock => unit_stock.variant, {nullable: true})
    unit_stocks: Unit_Stocks[] | null;

    @ManyToMany(() => Bills, bill => bill.variant, {nullable: true})
    @JoinTable()
    bill: Bills[] | null;

    @Column({ default: 0 })
    batch_no: number;

    @Column({ type: 'decimal', precision: 7, scale: 2 })
    buying_price: number;

    @Column({ type: 'decimal', precision: 7, scale: 2 })
    selling_price: number;

    @Column({type:"date"})
    mfd: Date;

    @Column({type:"date"})
    exp: Date;
}