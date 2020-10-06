import { PrimaryGeneratedColumn, Column, Entity,  JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { ProductRovianda } from "./Product.Rovianda";

import { User } from './User';
import { FormulationIngredients } from "./Formulation.Ingredients";

import { DefrostFormulation } from "./Defrost.Formulation";
import { Process } from "./Process";


@Entity({ name: "formulation" })
export class Formulation {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type=>ProductRovianda, productRovianda=>productRovianda.formulation, {cascade:true,eager:true, onDelete:"SET NULL"})
    @JoinColumn({ name: "product_rovianda_id" })
    productRovianda:ProductRovianda;

    @Column()
    temp: string;

    @Column()
    date: string;

    @Column({ name: "water_temp" })
    waterTemp: string;


    @ManyToOne(type=>User, verifit=>verifit.formulationVerifit, {eager:true, onDelete:"SET NULL"})
    verifit:User;

    @ManyToOne(type=>User, make=>make.formulationMake, {eager:true, onDelete:"SET NULL"})
    make:User;

    @OneToMany(type => FormulationIngredients, ingredients => ingredients.formulation,{cascade:true})
    ingredients: FormulationIngredients[];

    @Column()
    status:string;

    @OneToMany(type=>DefrostFormulation,defrost=>defrost.formulation,{eager:true,cascade:true})
    defrosts:DefrostFormulation[];

    @OneToOne(type=>Process,process=>process.formulation)
    process:Process;

    @Column({name:"lot_day"})
    lotDay:string;

}