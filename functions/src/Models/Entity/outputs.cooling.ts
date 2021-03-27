import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne, JoinColumn, OneToOne  } from "typeorm";
import { Defrost } from "./Defrost";
import { Formulation } from "./Formulation";
import { Raw } from "./Raw";


@Entity({name:"outputs_cooling"})
export class OutputsCooling{

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(type=>Raw, raw=>raw.outputsCoolings, {eager:true, onDelete:"SET NULL"})
    rawMaterial:Raw;

    @Column({name:"output_date"})
    outputDate:string;

    @Column({name:"lote_interno"})
    loteInterno:string;

    @Column()
    quantity:string;

    @Column()
    observations:string;

    @Column()
    status:string;
    
    @OneToOne(type=>Formulation,{nullable:true})
    formulation:Formulation;

    // @OneToOne(()=>Defrost,defrost=>defrost.outputCooling)
    // defrost:Defrost;

    @OneToOne(type=>Defrost,defrost=>defrost.outputCooling)
    defrost:Defrost;

    @Column({name:"lote_proveedor",nullable:true})
    loteProveedor:string;
}