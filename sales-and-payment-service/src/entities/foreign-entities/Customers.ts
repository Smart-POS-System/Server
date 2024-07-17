import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Bills } from "../Bills";

@Entity()
export class Customers {
  @PrimaryColumn()
  mobile_number: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @CreateDateColumn()
  registered_date: Date;

  @Column()
  loyalty_points: number;

  @OneToMany(() => Bills, bill => bill.bill_id, {nullable: true})
  bills: Bills[] | null;
}
