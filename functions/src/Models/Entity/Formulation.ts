import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn, JoinTable, ManyToOne, OneToMany } from "typeorm";
import { ProductRovianda } from "./Product.Rovianda";
import { Product } from "./Product";
import { OutputsDrief } from "./Outputs.Drief";
import { User } from './User';
import { FormulationIngredients } from "./Formulation.Ingredients";


@Entity({ name: "formulation" })
export class Formulation {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type=>ProductRovianda, productRovianda=>productRovianda.formulation, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({ name: "product_rovianda_id" })
    productRovianda:ProductRovianda;

    @Column({ name: "lote_interno" })
    loteInterno: string;

    @Column()
    temp: string;

    @Column()
    date: string;

    @Column({ name: "water_temp" })
    waterTemp: string;

    @Column({ name: "new_lote" })
    newLote: string;

    @ManyToOne(type=>User, verifit=>verifit.formulationVerifit, {eager:true, onDelete:"SET NULL"})
    verifit:User;

    @ManyToOne(type=>User, make=>make.formulationMake, {eager:true, onDelete:"SET NULL"})
    make:User;

    @OneToMany(type => FormulationIngredients, formulationIngredients => formulationIngredients.formulationId)
    formulationIngredients: FormulationIngredients[];
}