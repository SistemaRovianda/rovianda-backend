import { Entity, ManyToMany, JoinColumn, PrimaryGeneratedColumn, Column } from "typeorm";
import { Product } from "./Product";

@Entity({name:"products_rovianda"})
export class ProductRovianda{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({name:"product_name"})
    productName:string;
    
    @ManyToMany(type=>Product)
    @JoinColumn()
    ingredients:Product[];
}