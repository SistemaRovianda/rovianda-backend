import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./Client";

@Entity({name:"visit_client_operation"})
export class VisitClientOperation{

    @PrimaryGeneratedColumn({name:"visit_id"})
    visitId:number;

    
    @ManyToOne(type=>Client,client=>client.visits)
    @JoinColumn({name:"client_id"})
    client:Client;

    @Column({name:"start_visit_time"})
    startVisitTime:string;

    @Column({name:"end_visit_time",nullable:true})
    endVisitTime:string;

    @Column({name:"date_visited"})
    date:string;

}