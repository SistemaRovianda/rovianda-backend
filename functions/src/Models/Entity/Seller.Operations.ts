import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { User } from "./User";

@Entity({name:"seller_operations"})
export class SellerOperation{

    @PrimaryGeneratedColumn({name:"seller_operation_id"})
    sellerOperationId:number;

    @ManyToOne(type=>User,user=>user)
    seller:User;

    @Column()
    date:string;

    @Column({name:"eating_time_start"})
    eatingTimeStart:string;

    @Column({name:"eating_time_end"})
    eatingTimeEnd:string;
}