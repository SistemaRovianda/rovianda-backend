import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Client } from "./Client";
import { Sale } from "./Sales";

@Entity({name:"debts"})
export class Debts{

    @PrimaryGeneratedColumn({name:"deb_id"})
    debId:number;

    @ManyToOne(type=>Client,client=>client.debs)
    @JoinColumn({name:"client_id"})
    client:Client;

    @Column()
    amount:number;

    @Column()
    status:boolean;

    @Column({name:"create_day"})
    createDay:string;

    @Column()
    days:number;

    @OneToOne(type=>Sale)
    @JoinColumn({name:"sale_id"})
    sale:Sale;
}