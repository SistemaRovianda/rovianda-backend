import { PrimaryGeneratedColumn, Column, Entity, OneToMany  } from "typeorm";


@Entity({name:"outputs_cooling"})
export class OutputsCooling{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:"raw_material"})
    rawMaterial:string;

    @Column({name:"output_date"})
    outputDate:string;

    @Column({name:"lote_interno"})
    loteInterno:string;

    @Column()
    quantity:string;

    @Column()
    observations:string;
    
    
}