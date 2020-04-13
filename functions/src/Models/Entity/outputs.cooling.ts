import { PrimaryGeneratedColumn, Column, Entity, OneToMany  } from "typeorm";


@Entity({name:"outputs_cooling"})
export class OutputsCooling{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    raw_material:string;

    @Column()
    output_date:string;

    @Column()
    lote_interno:string;

    @Column()
    quantity:string;

    @Column()
    observations:string;
    
    
}