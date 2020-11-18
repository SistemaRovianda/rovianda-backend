import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductRovianda } from "./Product.Rovianda";
@Entity({name:"cheeses"})
export class Cheese{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    code:string;

    @Column()
    description:string;

    @OneToOne(type=>ProductRovianda,{eager:true})
    @JoinColumn()
    product:ProductRovianda;

}