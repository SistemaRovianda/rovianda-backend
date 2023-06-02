import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"presales_vinculation_seller"})
export class PreSalesVinculationSeller{
    @PrimaryGeneratedColumn({name:"presale_vinculation_seller_id"})
    preSaleVinculationSellerId:number;

    @Column({name:"presale_seller_id",nullable:false})
    preSaleSellerId:string;

    @Column({name:"deliver_user_id",nullable:false})
    deliverUserId:string;

}