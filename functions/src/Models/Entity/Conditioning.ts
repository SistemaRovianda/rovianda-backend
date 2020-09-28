
import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Process } from "./Process";
import { Product } from "./Product";
import { ProductRovianda } from "./Product.Rovianda";

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

    // //@OneToOne(type => Product)
    // //@JoinColumn({name:"product_id"})
    // @ManyToOne(type=>Product, productId=>productId.conditioning, {eager:true, onDelete:"SET NULL"})
    // @JoinColumn({name:"product_id"})
    // productId: Product;

    @ManyToOne(type => ProductRovianda,productId=>productId.conditioning)
    @JoinColumn({name:"product_id"})
    productId:ProductRovianda;

    @Column()
    temperature:string;

    @ManyToOne(type=>Process,process=>process.conditioning)
    @JoinColumn({name:"process_id"})
    process:Process;

    @Column()
    lotId:string;
}
