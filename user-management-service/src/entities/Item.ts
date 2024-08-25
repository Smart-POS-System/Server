import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from "typeorm";
import { Product } from "./Product";
import { Stock } from "./Stock";

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  item_id: number;

  @ManyToOne(() => Product, (product) => product.items)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @OneToMany(() => Stock, (stock) => stock.item)
  stocks: Stock[];

  @Column({ default: 0 })
  batch_no: number;

  @Column({ type: "decimal", precision: 7, scale: 2 })
  buying_price: number;

  @Column({ type: "decimal", precision: 7, scale: 2 })
  selling_price: number;

  @Column({ type: "date" })
  mfd: Date;

  @Column({ type: "date" })
  exp: Date;
}
