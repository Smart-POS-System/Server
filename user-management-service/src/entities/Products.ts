import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { Product_Variants } from './Product_Variants';

@Entity()
export class Products {
    @PrimaryGeneratedColumn()
    product_id: number;

    @Column({ unique: true })
    product_name: string;

    @Column({type: 'decimal', precision: 6, scale: 3})
    unit_weight: number;

    @OneToMany(() => Product_Variants, variant => variant.product, {nullable: true})
    variants: Product_Variants[] | null;
}