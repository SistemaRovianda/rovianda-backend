

import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, ManyToOne, JoinColumn, OneToMany, OneToOne} from "typeorm";
import { Defrost } from "./Defrost";
import { Process } from "./Process";
import { Raw } from "./Raw";

@Entity({name:"grinding"})
export class Grinding{

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(type=>Raw,raw=>raw.grindings,{eager:false})
    @JoinColumn({name:"raw_id"})
    raw:Raw;

    @ManyToOne(type => Process, process => process.grinding)
    process:Process;

    @Column()
    weight:string;
    
    @Column()
    date:string;

   @Column({type:"float"})
   temperature:number;

    @Column({name:"lot_id"})
    lotId:string;

    @Column({name:"single_process"})
    singleProcess:string;

    // @OneToOne(type=>Defrost,defrost=>defrost.grinding,{eager:true})
    // @JoinColumn({name:"defrost_id"})
    // defrost:Defrost;
}



