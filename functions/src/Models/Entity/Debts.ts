import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Client } from "./Client";
import { Sale } from "./Sales";
import { User } from "./User";

@Entity({name:"debts_sale"})
export class Debts{

    @PrimaryGeneratedColumn({name:"deb_id"})
    debId:number;

  

    @Column()
    amount:number;

    @Column()
    status:boolean;

    @Column({name:"create_day"})
    createDay:string;

    @Column()
    days:number;

    @ManyToOne(type=>Sale,sale=>sale.debts)
    @JoinColumn({name:"sale_id"})
    sale:Sale;

    @ManyToOne(type=>User,seller=>seller.debts)
    @JoinColumn({name: "seller_id"})
    seller:User;
}