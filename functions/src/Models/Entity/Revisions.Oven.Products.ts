import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, ManyToOne, JoinColumn} from "typeorm";
import { OvenProducts } from "./Oven.Products";



@Entity({name:"revisions_oven_products"})
export class RevisionsOvenProducts{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:"estimated_time"})
    hour:string;

    @Column({name:"inter_temp"})
    inter_temp:string;

    @Column({name:"oven_temp"})
    ovenTemp:string;

    @Column()
    humidity:string;

    @Column()
    observations:string;

    @ManyToOne(type=>OvenProducts, ovenProducts=>ovenProducts.revisionsOvenProducts, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"oven_products_id"})
    ovenProducts:OvenProducts;
    
}