import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Bills } from "../Bills";

@Entity()
export class Units {
    @PrimaryGeneratedColumn()
    unit_id: number;

    @Column()
    region_id: number;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    manager_id: number;

    @OneToMany(() => Bills, bill => bill.bill_id, {nullable: true})
    bills: Bills[];
}