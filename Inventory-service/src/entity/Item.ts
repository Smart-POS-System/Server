import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { Product } from "./Product";

@Entity()
@Unique(["product", "buying_price", "selling_price", "mfd", "exp"])
export class Item {
  @PrimaryGeneratedColumn()
  item_id: number;

  @ManyToOne(() => Product, (product) => product.items)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column()
  batch_code: string;

  @Column()
  buying_price: number;

  @Column()
  selling_price: number;

  @Column({ type: "date" })
  mfd: Date;

  @Column({ type: "date" })
  exp: Date;
}
