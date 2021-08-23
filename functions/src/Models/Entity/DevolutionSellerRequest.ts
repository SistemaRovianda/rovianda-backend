import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"devolutions_sellers_requests"})
export class DevolutionSellerRequest{
    @PrimaryGeneratedColumn({name:"devolution_seller_request_id"})
    devolutionSellerRequestId:number;
    
    @Column({name:"seller_id",nullable:false})
    sellerId:string;

    @Column({name:"sale_id",nullable:false})
    saleId:number;

    @Column({name:"folio",nullable:false})
    folio:string;

    @Column({name:"create_at",nullable:false})
    createAt:string;

    @Column({name:"status",default:"PENDING"})
    status:string;

    @Column({name:"date_attended",nullable:true})
    dateAttended:string;

    @Column({name:"type_devolution",nullable:false})
    typeDevolution:string;

    @Column({name:"observations",nullable:false})
    observations:string;

    @Column({name:"viewed",default:false})
    viewed:boolean;

    @Column({name:"devolution_app_request_id",nullable:true})
    devolutionAppRequestId:number;

    @Column({name:"admin_id"})
    adminId:string;
}