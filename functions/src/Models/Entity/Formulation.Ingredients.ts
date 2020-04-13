import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn} from "typeorm";
import { Entrances_Meat } from "./Entrances.Meat"
import { Product } from "./Product";
import { Formulation } from './Formulation';

@Entity({name:"formulation_ingredients"})
export class FormulationIngredients{

    @PrimaryGeneratedColumn()
    id:number;
    
    @OneToOne(type => Product)
    @JoinColumn()
    product_id:number;
    
    @OneToOne(type => Formulation)
    @JoinColumn()
    formulation_id
}