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

    @OneToOne(type => ProductRovianda ,productRovianda => productRovianda.id)
    @JoinColumn()
    @Column({name:"product_id"})
    productId:number;

    @OneToOne(type => Process , process => process.newLote)
    @JoinColumn()
    @Column({name:"lot_process"})
    lotProcess:string;

    @OneToOne(type => OvenProducts , ovenProducts=>ovenProducts.newLote)
    @JoinColumn()
    @Column({name:"lot_repro"})
    lotRepro:string;

    @Column()
    allergens:string;

    @Column()
    area:string;

}