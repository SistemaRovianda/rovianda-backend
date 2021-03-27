import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DefrostFormulation } from "./Defrost.Formulation";
import { OutputsCooling } from "./outputs.cooling";
import { Reprocessing } from "./Reprocessing";

@Entity({name:"defrost"})
export class Defrost{

    @PrimaryGeneratedColumn({name:"defrost_id"})
    defrostId:number;

    // @OneToOne(type=>OutputsCooling,out=>out.defrostE,{cascade:true})
    // @JoinColumn()
    // outputCooling:OutputsCooling;

    @OneToOne(type=>OutputsCooling,output=>output.defrost)
    @JoinColumn({name:"output_cooling"})
    outputCooling:OutputsCooling;
    
    @Column()
    weigth:string;

    @Column()
    temp:string;

    @Column({name:"entrance_hour"})
    entranceHour:string;

    @Column({name:"output_hour",nullable:true})
    outputHour:string;

    @Column({name:"date_init"})
    dateInit:string;

    @Column({name:"date_end",nullable:true})
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