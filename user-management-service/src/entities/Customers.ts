import "reflect-metadata";
import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Bills } from "./Bills";

@Entity()
export class Customers {
  @PrimaryColumn()
  mobile: string;

  @OneToMany(() => Bills, bill => bill.customers, {nullable: true})
  bills: Bills[] | null;

  @Column()
  name: string;

  @Column()
  address: string;

  @CreateDateColumn({type: "timestamp"})
  registered_date: Date;

  @Column()
  loyalty_points: number;
}
