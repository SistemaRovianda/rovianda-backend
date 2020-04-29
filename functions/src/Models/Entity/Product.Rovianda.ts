import { Entity, ManyToMany, JoinColumn, PrimaryGeneratedColumn, Column } from "typeorm";
import { Product } from "./Product";

@Entity({name:"products_rovianda"})
export class ProductRovianda{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;
    
    @ManyToMany(type=>Product,{cascade:true,eager:false})
    @JoinColumn()
    ingredients:Product[];
}