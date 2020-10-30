import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DefrostFormulation } from "./Defrost.Formulation";
import { OutputsCooling } from "./outputs.cooling";
import { Reprocessing } from "./Reprocessing";

@Entity({name:"defrost"})
export class Defrost{

    @PrimaryGeneratedColumn({name:"defrost_id"})
    defrostId:number;

    @OneToOne(type=>OutputsCooling,{eager:true})
    @JoinColumn()
    outputCooling:OutputsCooling;

    @Column()
    weigth:string;

    @Column()
    temp:string;

    @Column({name:"entrance_hour"})
    entranceHour:string;

    @Column({name:"output_hour"})
    outputHour:string;

    @Column({name:"date_init"})
    dateInit:string;

    @Column({name:"date_end"})
    dateEnd:string;

    @Column()
    status:string;

    @OneToMany(type=>DefrostFormulation,defrostFormulation=>defrostFormulation.defrost)
    defrostFormulations:DefrostFormulation[]

    @OneToMany(type=>Reprocessing,reprocesing=>reprocesing.defrost)
    reprocesings:Reprocessing[];

}