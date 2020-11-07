import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import { Defrost } from "./Defrost";
import { Process } from "./Process";
import { Product } from "./Product";
import { ProductRovianda } from "./Product.Rovianda";

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

    // @ManyToOne(type=> Product, productId=>productId.tenderized)
    // @JoinColumn({name:"product_id"})
    // productId:Product;

    @Column()
    raw:string;

    @Column({name:"lote_meat"})
    loteMeat:string;

    @ManyToOne(type=>Process,process=>process.tenderized)
    @JoinColumn({name:"process_id"})
    process:Process;

    // @OneToOne(type=>Defrost,defrost=>defrost.tenderized)
    // @JoinColumn({name:"defrost_id"})
    // defrost:Defrost;
}






