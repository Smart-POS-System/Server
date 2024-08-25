import "reflect-metadata";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./Employee";
import { Location } from "./Location";
import { Item } from "./Item";

@Entity()
export class Stock {
    @PrimaryGeneratedColumn()
    stock_id: number;

    @Column({type: 'decimal', precision: 6, scale: 3})
    quantity: number;

    @ManyToOne(() => Location, location => location.stocks)
    @JoinColumn({name: 'location_id'})
    location: Location;

    @ManyToOne(() => Employee, employee => employee.stocks)
    @JoinColumn({name: 'manager_id'})
    employee: Employee;

    @ManyToOne(() => Item, item => item.stocks)
    @JoinColumn({name: 'item_id'})
    item: Item;
}