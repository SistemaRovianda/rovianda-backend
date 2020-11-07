import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Conditioning } from "./Conditioning";
import { DefrostFormulation } from "./Defrost.Formulation";
import { Grinding } from "./Grinding";
import { OutputsCooling } from "./outputs.cooling";
import { Reprocessing } from "./Reprocessing";
import { Sausaged } from "./Sausaged";
import { Tenderized } from "./Tenderized";

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


    // @OneToOne(type=>Conditioning,conditioning=>conditioning.defrost)
    // conditioning:Conditioning;

    // @OneToOne(type=>Tenderized,tenderized=>tenderized.defrost)
    // tenderized:Tenderized;

    // @OneToOne(type=>Sausaged,sausaged=>sausaged.defrost)
    // sausaged:Sausaged;

    // @OneToOne(type=>Grinding,grinding=>grinding.defrost)
    // grinding:Grinding;

}