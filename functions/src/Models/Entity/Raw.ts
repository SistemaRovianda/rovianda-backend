import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany  } from "typeorm";
import { OutputsCooling } from './outputs.cooling';
import { Cooling } from './Cooling';
import { Grinding } from "./Grinding";


@Entity({name:"raw"})
export class Raw{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:"raw_material"})
    rawMaterial:string;

    @OneToMany(type=> OutputsCooling,outputsCooling=>outputsCooling.rawMaterial,{eager:false})
    outputsCoolings: OutputsCooling[];

    @OneToMany(type=> Cooling,cooling=>cooling.rawMaterial,{eager:false})
    coolings: Cooling[];

    @OneToMany(type=>Grinding,grinding=>grinding.raw,{eager:true})
    grindings:Grinding[];
    
}

