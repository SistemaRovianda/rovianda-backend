import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn} from "typeorm";
import { Entrances_Meat } from "./Entrances.Meat"
import { Product } from "./Product";

@Entity({name:"sausaged"})
export class Sausaged{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    temperature:string;

    @Column()
    date:string;

    @Column()
    weight_ini:string;

    @Column()
    hour1:string;

    @Column()
    weight_medium:string;

    @Column()
    hour2:string;

    @Column()
    weight_exit:string;

    @Column()
    hour3:string;
    
    @OneToOne(type => Product)
    @JoinColumn()
    product_id:Product;
}


