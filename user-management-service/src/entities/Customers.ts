import "reflect-metadata";
import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Bills } from "./foreign-entities/Bills";

@Entity()
export class Customers {
  @PrimaryColumn()
  mobile_number: string;

  // @OneToMany(() => Bills, bill => bill.bill_id, {nullable: true})
  // bills: Bills[];

  @Column()
  name: string;

  @Column()
  address: string;

  @CreateDateColumn({type: "timestamp"})
  registered_date: Date;

  @Column()
  loyalty_points: number;
}
