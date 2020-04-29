import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";

@Entity({name:"sale"})
export class Sale{

    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(type => Product)
    @JoinColumn({name:"product_id"})
    productId:number;

    @Column()
    total:number;

    @Column()
    term:number;
    
    
}