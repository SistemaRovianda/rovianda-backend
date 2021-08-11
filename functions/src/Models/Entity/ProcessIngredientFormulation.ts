import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Formulation } from "./Formulation";
import { Process } from "./Process";

@Entity({name:"process_ingredients_formulations"})
export class ProcessIngredientFormulation{

    @PrimaryGeneratedColumn({name:"process_ingredients_formulation_id"})
    processIngredientsFormulationId:number;

    @ManyToOne(type=>Formulation,formulation=>formulation.processIngredients)
    @JoinColumn({name:"formulation_id"})
    formulation:Formulation;

    @ManyToOne(type=>Process,process=>process.processIngredientsFormulations)
    @JoinColumn({name:"process_id"})
    process:Process;

}