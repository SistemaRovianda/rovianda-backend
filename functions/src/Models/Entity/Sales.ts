import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Client } from "./Client";
import { SubSales } from "./Sub.Sales";
import { Debts } from "./Debts";
import { Float } from "mssql";

@Entity({name:"sales"})
export class Sale{

    @PrimaryGeneratedColumn({name:"sale_id"})
    saleId:number;

    @ManyToOne(type=>User,user=>user.sales)
    @JoinColumn({name:"seller_id"})
    seller:User;

    @Column()
    date:string;

    @Column()
    hour:string;
    
    @Column({type:"float",nullable:false})
    amount:number;

    @Column({name:"payed_with",type:"float",nullable:false})
    payedWith:number;

    @Column({nullable:true})
    credit: number;

    @Column({name:"type_sale"})
    typeSale:string;

    @OneToMany(type=>Debts,debts=>debts.sale,{eager:true,cascade:true})
    debts:Debts[];

    @ManyToOne(type=>Client,client=>client.sales,{eager:true})
    @JoinColumn({name:"client_id"})
    client:Client;
    
    @OneToMany(type=>SubSales,subSale=>subSale.sale,{eager:true,cascade:true})
    subSales:SubSales[];

    @Column()
    status:boolean;

    @Column()
    folio:string;

    @Column({name:"with_debts",nullable:false,default:false})
    withDebts:boolean;

    @Column({name:"status_str",nullable:true})
    statusStr:string;
    @Column({name:"new_folio",nullable:true})
    newFolio:string;

    @Column({name:"sincronized",default:false})
    sincronized:boolean;

    @Column({name:"folio_temp",nullable:true})
    folioTemp:string;

    @Column({name:"date_sincronized",nullable:true})
    dateSincronized:string;

    @Column({name:"cancel_request",default:false})
    cancelRequest:boolean;

    @Column({name:"devolution_request",default:false})
    devolutionRequest:boolean;

    @Column({name:"folio_index",nullable:true,unique:true})
    folioIndex:string;

}