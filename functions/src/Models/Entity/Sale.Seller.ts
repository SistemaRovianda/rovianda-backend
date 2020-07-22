import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { SalesRequest } from "./Sales.Request";

@Entity({name:"sale_seller"})
export class SaleSeller{

    @PrimaryGeneratedColumn({name:"sale_seller_id"})
    id:number;

    @ManyToOne(type=>User, user=>user.saleSeller, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"user_ids"})
    user:User;

    @Column()
    date:string

    @Column()
    status:boolean;

    @Column()
    urgent: boolean;

    @OneToMany(type=> SalesRequest,saleRequest=>saleRequest.saleSeller)
    saleRequest: SalesRequest[];
}