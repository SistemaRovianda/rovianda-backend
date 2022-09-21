import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./Client";

@Entity({name:"days_visited"})
export class DayVisited{

    @PrimaryGeneratedColumn({name:"days_visited_id"})
    daysVisitedId:number;

    @Column({name:"monday",default:false})
    monday:boolean;

    @Column({name:"tuesday",default:false})
    tuesday:boolean;

    @Column({name:"wednesday",default:false})
    wednesday:boolean;

    @Column({name:"thursday",default:false})
    thursday:boolean;

    @Column({name:"friday",default:false})
    friday:boolean;

    @Column({name:"saturday",default:false})
    saturday:boolean;

    @Column({name:"sunday",default:false})
    sunday:boolean;

    @OneToOne(type=>Client)
    @JoinColumn({name:"client_id"})
    client:Client;
}