import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn} from "typeorm";
import { Product } from "./Product";
import { Formulation } from './Formulation';

@Entity({name:"formulation_ingredients"})
export class FormulationIngredients{

    @PrimaryGeneratedColumn()
    id:number;
    
    @OneToOne(type => Product)
    @JoinColumn({name:"product_id"})
    productId:number;
    
    @OneToOne(type => Formulation)
    @JoinColumn({name:"formulation_id"})
    formulationId
}