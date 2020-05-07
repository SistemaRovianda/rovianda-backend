import { PrimaryGeneratedColumn, Column, Entity, JoinColumn, OneToOne, ManyToOne  } from "typeorm";
import { Product } from "./Product";


@Entity({name:"oven_products"})
export class OvenProducts{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    estimated_time:string;

    @Column()
    new_lote:string;

    @Column()
    pcc:string;

    @Column()
    date:string;

    @OneToOne(type => Product,{eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"product_id"})
    product_id: Product;

}