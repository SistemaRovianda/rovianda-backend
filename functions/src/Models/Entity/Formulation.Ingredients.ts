import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./Product";
import { Formulation } from './Formulation';
import { OutputsCoolingService } from "../../Services/Outputs.Cooling.Service";
import { OutputsDrief } from "./Outputs.Drief";

@Entity({ name: "formulation_ingredients" })
export class FormulationIngredients {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Product,product=>product.formulationIngredients,{eager:false})
    @JoinColumn({ name: "product_id" })
    product: Product;

    @ManyToOne(type => Formulation, formulation => formulation.ingredients)
    @JoinColumn({ name: "formulation_id" })
    formulation: Formulation;

    @OneToOne(type => OutputsDrief,outputsDrief=>outputsDrief.formulationIngredient,{cascade:true})
    @JoinColumn({ name: "lot_id" })
    lotId: OutputsDrief;
}