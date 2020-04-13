import { Column, Entity, ManyToMany, PrimaryColumn} from "typeorm";
import { Product } from "./Product";
import { ProductsRovianda } from './Products.Rovianda';

@Entity({name:"ingredients"})
export class Ingredients{

    @PrimaryColumn()
    @ManyToMany(type =>Product , product => product.id)
    product_id :number;


    @PrimaryColumn()
    @ManyToMany(type =>ProductsRovianda , products_rovianda => products_rovianda.id)
    products_rovianda_id:number;


}