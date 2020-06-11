import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { ProductRovianda } from './Product.Rovianda';
import { Process } from './Process';
import { OvenProducts } from './Oven.Products';

@Entity({name:"reprocessing"})
export class Reprocessing{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    date:string;

    @Column({name:"product_id"})
    productId:number;

    @Column({name:"lot_process"})
    lotProcess:string;

    @Column({name:"lot_repro"})
    lotRepro:string;

    @Column()
    allergens:string;

    @Column()
    area:string;

}