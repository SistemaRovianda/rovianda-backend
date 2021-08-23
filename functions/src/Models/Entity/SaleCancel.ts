import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"sales_canceled"})
export class SaleCancel{

    @PrimaryGeneratedColumn({name:"sales_canceled_id"})
    salesCanceledId:number;

    @Column({name:"folio"})
    folio:string;

    @Column({name:"create_at"})
    createAt:string;

    @Column({name:"admin_id",nullable:true})
    admin:string;

    @Column({name:"seller_id",nullable:false})
    seller:string;

    @Column({name:"modified_at",nullable:true})
    modifiedAt:string;

    @Column({name:"status",default:"PENDING"})
    status:string;

    @Column({name:"viewed",default:false})
    viewed:boolean;

}