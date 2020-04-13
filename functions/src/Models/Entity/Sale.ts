import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";

@Entity({name:"sale"})
export class Sale{

    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(type => Product)
    @JoinColumn()
    product_id:number;

    @Column()
    total:number;

    @Column()
    term:number;
    
    
}