import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Item } from "./Item";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column({ unique: true })
  product_name: string;

  @Column()
  unit_weight: string;

  @OneToMany(() => Item, (item) => item.product)
  items: Item[];
}
