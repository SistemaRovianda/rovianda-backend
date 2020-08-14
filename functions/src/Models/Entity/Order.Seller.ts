import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { SubOrder } from "./SubOrder.Sale.Seller";

@Entity({name:"orders_sellers"})
export class OrderSeller{

    @PrimaryGeneratedColumn({name:"order_seller_id"})
    id:number;

    @ManyToOne(type=>User, user=>user.saleSeller, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"user_id"})
    user:User;

    @Column()
    date:string

    @Column()
    status:boolean;

    @Column()
    urgent: boolean;

    @OneToMany(type=> SubOrder,saleRequest=>saleRequest.orderSeller,{cascade:true})
    subOrders?: SubOrder[];
}