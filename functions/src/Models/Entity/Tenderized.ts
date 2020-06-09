import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import { Product } from "./Product";

@Entity({name:"tenderized"})
export class Tenderized{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    temperature:string;

    @Column()
    weight:number;

    @Column({name:"weight_salmuera"})
    weightSalmuera:number;

    @Column()
    date:string;
    
    @Column({name:"percent_inject"})
    percentInject:number;

    // @OneToOne(type => Product)
    // @JoinColumn({name:"product_id"})
    // productId:Product;

    @ManyToOne(type=> Product, productId=>productId.tenderized,{eager:true})
    @JoinColumn({name:"product_id"})
    productId:Product;


}






