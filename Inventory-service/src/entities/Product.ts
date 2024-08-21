import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { Item } from './Item';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    product_id: number;

    @Column({ unique: true })
    product_name: string;

    @Column({type: 'decimal', precision: 6, scale: 3})
    unit_weight: number;

    @OneToMany(() => Item, item => item.product)
    items: Item[];
}