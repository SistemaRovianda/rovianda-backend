import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { SubOrder } from "./SubOrder.Sale.Seller";

@Entity({name:"orders_sellers"})
export class OrderSeller{

    @PrimaryGeneratedColumn({name:"order_seller_id"})
    id:number;

    @ManyToOne(type=>User, user=>user.saleSeller, {eager:false, onDelete:"SET NULL"})
    @JoinColumn({name:"seller_id"})
    seller:User;

    @Column()
    date:string

    @Column()
    status:string;

    @Column()
    urgent: boolean;

    @OneToMany(type=> SubOrder,saleRequest=>saleRequest.orderSeller,{cascade:true})
    subOrders: SubOrder[];

    @Column({name:"date_attended",nullable:true})
    dateAttended:string;

    @Column({name:"sincronized",default:false})
    sincronized:boolean;

    @Column({name:"folio_remission",nullable:true})
    folioRemission:number;

    @Column({name:"index_noduplicate",nullable:true,unique:true})
    indexNoDuplicate:string;
}