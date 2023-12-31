import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Address } from "./Address";
import { Debts } from "./Debts";
import { Sale } from "./Sales";
import { User } from "./User";
import { VisitClientOperation } from "./VisitClientOperation";
import { VisitEntity } from "./VisitEntity";

@Entity({name:"clients"})
export class Client{

    @PrimaryGeneratedColumn({name:"clients_client_id"})
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

    @Column({default:0})
    credit:number;

    @Column({nullable:true})
    cfdi:string;

    @Column({name:"payment_sat",nullable:true})
    paymentSat:string;

    @Column({name:"current_credit",nullable:true})
    currentCredit:number;

    @Column({name:"days_credit",nullable:true})
    daysCredit:number;

    @Column({name:"day_charge",nullable:true})
    dayCharge:number;

    @OneToOne(()=>Address,{eager:true,cascade:true})
    @JoinColumn({name:"address_id"})
    address:Address;

    @Column()
    rfc:string;

    @Column({nullable:true})
    curp:string;

    @OneToMany(type=>Sale,sale=>sale.client)
    sales:Sale[];

    @ManyToOne(type=>User,user=>user.clientsArr,{nullable:true})
    @JoinColumn({name:"seller_owner"})
    seller:User;

    @Column({nullable:true})
    clasification:string;

    @Column({name:"has_debts",default:false})
    hasDebts:boolean;


    @OneToMany(type=>VisitClientOperation,visit=>visit.client)
    visits:VisitClientOperation[];

    @Column({default:"ACTIVE"})
    status:string;

    @Column({name:"key_sae_new",nullable:true})
    keySaeNew:string;
    
    @Column({name:"modified",nullable:true,default:false})
    modified:boolean;

    @Column({name:"longitude",nullable:true,type:"double"})
    longitude:number;
    @Column({name:"latitude",nullable:true,type:"double"})
    latitude:number;
    @Column({name:"client_mobile_id",nullable:true})
    clientMobileId:number;

    @OneToMany(type=>VisitEntity,visitEntity=>visitEntity.client)
    visitsRecords:VisitEntity[];

    @Column({name:"reference",nullable:true})
    reference:string;

    @Column({name:"contact",nullable:true})
    contact:string;
}