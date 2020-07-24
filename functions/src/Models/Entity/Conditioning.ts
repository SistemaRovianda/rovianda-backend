
import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./Product";

@Entity({name:"conditioning"})
export class Conditioning{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    raw:string;

    @Column()
    bone:boolean;

    @Column()
    clean:boolean;

    @Column()
    healthing:boolean;

    @Column()
    weight:number;

    @Column()
    date:string;

    //@OneToOne(type => Product)
    //@JoinColumn({name:"product_id"})
    @ManyToOne(type=>Product, productId=>productId.conditioning, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"product_id"})
    productId: Product;

    @Column()
    temperature:string;
}
