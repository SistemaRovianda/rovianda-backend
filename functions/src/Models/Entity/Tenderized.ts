import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn} from "typeorm";
import { Entrances_Meat } from "./Entrances.Meat"
import { Product } from "./Product";

@Entity({name:"tenderized"})
export class Tenderized{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    temperature:string;

    @Column()
    weight:string;

    @Column()
    weight_salmuera:number;

    @Column()
    date:string;
    
    @Column()
    percent_inject:number;

    @OneToOne(type => Product)
    @JoinColumn()
    product_id:number;
}






