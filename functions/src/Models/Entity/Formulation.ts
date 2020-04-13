import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn} from "typeorm";
import { ProductsRovianda } from './Products.Rovianda';

@Entity({name:"formulation"})
export class Formulation{

    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(type => ProductsRovianda)
    @JoinColumn()
    product_rovianda_id: ProductsRovianda;

    @Column()
    lote_interno:string;

    @Column()
    temp:string;

    @Column()
    water_temp:string;

    @Column()
    new_lote:string;

   

}