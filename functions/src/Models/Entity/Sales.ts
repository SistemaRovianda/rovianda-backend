import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Client } from "./Client";
import { SubSales } from "./Sub.Sales";
import { Debts } from "./Debts";

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
    
    @Column()
    amount:number;

    @Column()
    credit: number;

    @OneToMany(type=>Debts,debts=>debts.sale,{cascade:true})
    debts:Debts[];

    @ManyToOne(type=>Client,client=>client.sales)
    @JoinColumn({name:"client_id"})
    client:Client;
    
    @OneToMany(type=>SubSales,subSale=>subSale.sale,{eager:true,cascade:true})
    subSales:SubSales[];

}