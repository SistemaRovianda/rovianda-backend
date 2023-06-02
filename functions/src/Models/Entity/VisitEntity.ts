import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./Client";

@Entity({name:"visit_records"})
@Index("visit_records_IDX",["date","client"],{unique:true})
export class VisitEntity{
    @PrimaryGeneratedColumn({name:"visit_id"})
    visitId:number;

    @Column({name:"date"})
    date:string;

    @ManyToOne(type=>Client,client=>client.visitsRecords)
    @JoinColumn({name:"client_id"})
    client:Client;

    @Column({name:"observations"})
    observations:string;

    @Column({name:"visited"})
    visited:boolean;

    @Column({name:"amount",type:"float"})
    amount:number;
}