import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { Products } from './Products';
import { Unit_Stocks } from './foreign-entities/Unit_Stocks';

@Entity()
export class Product_Variants {
    @PrimaryGeneratedColumn()
    variant_id: number;

    @ManyToOne(() => Products, product => product.product_id)
    @JoinColumn({ name: 'product_id' })
    product: Products;

    @OneToMany(() => Unit_Stocks, unit_stock => unit_stock.stock_id, {nullable: true})
    unit_stocks: Unit_Stocks[] | null;

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