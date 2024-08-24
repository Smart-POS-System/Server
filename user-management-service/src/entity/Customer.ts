import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";
@Entity()
export class Customer {
  @PrimaryColumn()
  nic: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ unique: true })
  mobile: string;

  @CreateDateColumn()
  registered_date: Date;

  @Column()
  loyalty_points: number;
}
