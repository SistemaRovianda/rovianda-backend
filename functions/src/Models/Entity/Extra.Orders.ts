import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity({name:"extras_orders"})
export class ExtrasOrders{

    @PrimaryGeneratedColumn()
    extra_id : number;

    @Column()
    description:string;

}