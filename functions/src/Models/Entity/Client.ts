import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Change } from "firebase-functions";
import { Address } from "./Address";
import { Debts } from "./Debts";
import { Sale } from "./Sales";
import { User } from "./User";

@Entity({name:"clients"})
export class Client{

    @PrimaryGeneratedColumn({name:"client_id"})
    id:number;

    @Column({name:"type_cliente"})
    typeClient:string;

    @Column({name:"key_client"})
    keyClient:string;

    @Column()
    name:string;

    @Column({name:"first_surname",nullable:true})
    firstSurname:string;
    
    @Column({name:"last_surname",nullable:true})
    lastSurname:string;

    @Column()
    credit:number;

    @Column({name:"current_credit"})
    currentCredit:number;

    @Column({name:"days_credit"})
    daysCredit:string;

    @OneToOne(type=>Address,{cascade:true})
    address:Address;

    @Column()
    rfc:string;

    @OneToMany(type=>Debts,debs=>debs.client)
    debs:Debts[];

    @OneToMany(type=>Sale,sale=>sale.client)
    sales:Sale[];

    @ManyToOne(type=>User,user=>user.clients)
    @JoinColumn({name:"seller_owner"})
    seller:User;

}