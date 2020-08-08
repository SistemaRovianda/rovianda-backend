
import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, ManyToOne, Raw, JoinColumn} from "typeorm";
import { ProductRovianda } from "./Product.Rovianda";

@Entity({name:"grinding"})
export class Grinding{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    raw:string;

    @Column()
    process:string;

    @Column()
    weight:string;
    
    @Column()
    date:string;

    @ManyToOne(type => ProductRovianda,productR=>productR.grinding)
    @JoinColumn({name:"product_rovianda_id"})
    product:ProductRovianda;
}



