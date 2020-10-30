

import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { Process } from "./Process";
import { ProductRovianda } from "./Product.Rovianda";
import { Raw } from "./Raw";

@Entity({name:"grinding"})
export class Grinding{

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(type=>Raw,raw=>raw.grindings)
    @JoinColumn({name:"raw_id"})
    raw:Raw;

    @ManyToOne(type => Process, process => process.grinding)
    process:Process;

    @Column()
    weight:string;
    
    @Column()
    date:string;

   

    @Column({name:"lot_id"})
    lotId:string;

    @Column({name:"single_process"})
    singleProcess:string;
}



