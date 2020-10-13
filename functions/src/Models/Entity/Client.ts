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

    @Column({name:"id_aspel"})
    idAspel:number;

    @Column({name:"type_cliente"})
    typeClient:string;

    @Column({name:"key_client"})
    keyClient:number;

    @Column()
    name:string;

    @Column({nullable:true})
    phone:string;

    @Column()
    credit:number;

    @Column({nullable:false})
    cfdi:string;

    @Column({name:"payment_sat"})
    paymentSat:string;

    @Column({name:"current_credit"})
    currentCredit:number;

    @Column({name:"days_credit"})
    daysCredit:number;

    @Column({name:"day_charge",nullable:true})
    dayCharge:number;

    @OneToOne(type=>Address,{cascade:true})
    address:Address;

    @Column()
    rfc:string;

    @Column({nullable:true})
    curp:string;

    @OneToMany(type=>Debts,debs=>debs.client)
    debs:Debts[];

    @OneToMany(type=>Sale,sale=>sale.client)
    sales:Sale[];

    @ManyToOne(type=>User,user=>user.clients,{nullable:true})
    @JoinColumn({name:"seller_owner"})
    seller:User;

    @Column({nullable:true})
    clasification:string;

    @Column({name:"has_debts"})
    hasDebts:boolean;

}