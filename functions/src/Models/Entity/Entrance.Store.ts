import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";
import { User } from './User';

@Entity({name:"entranceStore"})
export class EntranceStore{

    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(type => Product)
    @JoinColumn({name:"product_id"})
    productId: Product;
    
    @OneToOne(type => User)
    @JoinColumn({name:"vendedor_id"})
    vendedorId: Product;

    @Column()
    merma:boolean; 
    
    @Column()
    kilo:number;

    @Column()
    captured: Date;
}