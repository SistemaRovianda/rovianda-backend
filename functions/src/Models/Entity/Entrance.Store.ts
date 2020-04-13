import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";
import { User } from './Users';

@Entity({name:"entranceStore"})
export class EntranceStore{

    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(type => Product)
    @JoinColumn()
    product_id: Product;
    
    @OneToOne(type => User)
    @JoinColumn()
    vendedor_id: Product;

    @Column()
    merma:boolean; 
    
    @Column()
    kilo:number;

    @Column()
    captured: Date;
}