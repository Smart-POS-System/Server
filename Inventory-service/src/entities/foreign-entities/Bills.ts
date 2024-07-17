import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Units } from "../Units";

@Entity()
export class Bills {
    @PrimaryGeneratedColumn()
    bill_id: number;

    @Column()
    cashier_id: number;

    @ManyToOne(() => Units, unit => unit.unit_id)
    @JoinColumn({ name: 'store_id' })
    unit: Units;

    @Column()
    customer_id: number;

    @Column( { type: 'json'})
    bill_items: JSON;

    @Column({ type: 'float', precision: 3, scale: 1, default: 0.0 })
    discount: number;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    timestamp: Date;

    @Column()
    payment_method: string;

    @Column()
    status: string;

}