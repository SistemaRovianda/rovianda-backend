import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne, JoinColumn  } from "typeorm";
import { Raw } from "./Raw";


@Entity({name:"outputs_cooling"})
export class OutputsCooling{

    @PrimaryGeneratedColumn()
    id:number;

    // @Column({name:"raw_material"})
    // rawMaterial:string;
    @ManyToOne(type=>Raw, raw=>raw.outputsCoolings, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"raw_material_id"})
    rawMaterial:Raw

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
    
    
}