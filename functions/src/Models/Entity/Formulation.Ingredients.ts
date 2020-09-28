import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./Product";
import { Formulation } from './Formulation';
import { OutputsCoolingService } from "../../Services/Outputs.Cooling.Service";
import { OutputsDrief } from "./Outputs.Drief";

@Entity({ name: "formulation_ingredients" })
export class FormulationIngredients {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Product,{eager:true})
    @JoinColumn({ name: "product_id" })
    product: Product;

    @ManyToOne(type => Formulation, formulation => formulation.formulationIngredients)
    @JoinColumn({ name: "formulation_id" })
    formulation: Formulation;

    @ManyToOne(type => OutputsDrief)
    @JoinColumn({ name: "lot_id" })
    lotId: OutputsDrief;
}