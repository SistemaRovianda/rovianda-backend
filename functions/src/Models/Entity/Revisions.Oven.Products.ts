import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinColumn, OneToOne } from "typeorm";
import { OvenProducts } from "./Oven.Products";

@Entity({name:"revisions_oven_products"})
export class RevisionsOvenProducts{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:"hour"})
    hour:string;

    @Column({name:"inter_temp"})
    interTemp: string;

    @Column({name:"oven_temp"})
    ovenTemp: string;

    @Column({name:"humidity"})
    humidity: string;

    @Column({name:"observations"})
    observations: string;

    @OneToOne(type=>OvenProducts)
    @JoinColumn({name:"oven_products_id"})
    ovenProducts:OvenProducts;

}