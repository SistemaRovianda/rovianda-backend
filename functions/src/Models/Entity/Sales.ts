import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Client } from "./Client";
import { SubSales } from "./Sub.Sales";

@Entity({name:"sales"})
export class Sale{

    @PrimaryGeneratedColumn({name:"sale_id"})
    saleId:number;

    @ManyToOne(type=>User,user=>user.sales)
    @JoinColumn({name:"seller_id"})
    seller:string;

    @Column()
    date:string;
    
    @Column()
    amount:number;

    @Column()
    credit: number;


    @ManyToOne(type=>Client,client=>client.sales)
    @JoinColumn({name:"client_id"})
    client:Client;
    
    @OneToMany(type=>SubSales,subSale=>subSale.sale,{cascade:true})
    subSales:SubSales[];

}