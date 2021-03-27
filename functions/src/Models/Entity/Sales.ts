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

}