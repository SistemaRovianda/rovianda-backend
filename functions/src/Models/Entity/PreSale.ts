import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Client } from "./Client";
import { SubSales } from "./Sub.Sales";

@Entity({name:"pre_sales"})
export class PreSale{

    @PrimaryGeneratedColumn({name:"pre_sale_id"})
    preSaleId:number;

    @ManyToOne(type=>User,user=>user.preSales,{eager:true})
    @JoinColumn({name:"pre_seller_id"})
    seller:User;

    @Column({nullable:false,name:"date_created"})
    dateCreated:string;

    @Column({nullable:false,name:"date_to_deliver"})
    dateToDeliver:string;

    @Column({nullable:true,name:"date_solded"})
    dateSolded:string;
    
    @Column({type:"float",nullable:false})
    amount:number;

    @Column({name:"payed_with",type:"float",nullable:false})
    payedWith:number;

    @Column({name:"type_pre_sale",nullable:true})
    typeSale:string;

    @ManyToOne(type=>Client,client=>client.sales,{eager:true})
    @JoinColumn({name:"client_id"})
    client:Client;
    
    @OneToMany(type=>SubSales,subSale=>subSale.preSale,{eager:true,cascade:true})
    subSales:SubSales[];

    @Column({unique:true})
    folio:string;

    @Column({name:"status_str",nullable:true})
    statusStr:string;

    @Column({name:"new_folio",nullable:true})
    newFolio:string;

    @Column({name:"date_sincronized",nullable:true})
    dateSincronized:string;

    @Column({name:"solded",default:false})
    solded:boolean;

}