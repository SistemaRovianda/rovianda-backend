import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Defrost } from "./Defrost";
import { Formulation } from "./Formulation";


@Entity({name:"defrost_formulation"})
export class DefrostFormulation{

    @PrimaryGeneratedColumn({name:"defrost_formulation_id"})
    defrostFormulationId:number;

    @ManyToOne(type=>Defrost,defrost=>defrost.defrostFormulations,{eager:true})
    defrost:Defrost;

    @Column({name:"lot_meat"})
    lotMeat:string;

    @ManyToOne(type=>Formulation,formulation=>formulation.defrosts)
    @JoinColumn({name:"formulation_id"})
    formulation:Formulation;

}