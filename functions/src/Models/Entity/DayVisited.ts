import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./Client";

@Entity({name:"days_visited"})
export class DayVisited{

    @PrimaryGeneratedColumn({name:"days_visited_id"})
    daysVisitedId:number;

    @Column({name:"monday"})
    monday:boolean;

    @Column({name:"tuesday"})
    tuesday:boolean;

    @Column({name:"wednesday"})
    wednesday:boolean;

    @Column({name:"thursday"})
    thursday:boolean;

    @Column({name:"friday"})
    friday:boolean;

    @Column({name:"saturday"})
    saturday:boolean;

    @Column({name:"sunday"})
    sunday:boolean;

    @OneToOne(type=>Client)
    @JoinColumn({name:"client_id"})
    client:Client;
}