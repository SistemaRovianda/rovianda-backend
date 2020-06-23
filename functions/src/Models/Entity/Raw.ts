import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany  } from "typeorm";
import { OutputsCooling } from './outputs.cooling';
import { Cooling } from './Cooling';


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
    
}

