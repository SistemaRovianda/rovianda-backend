import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"devolutions_olds_sub_sales"})
export class DevolutionOldSubSales{
    
    @PrimaryGeneratedColumn({name:"devolution_old_sub_sale_id"})
    devolutionOldSubSaleId:number;

    @Column({name:"quantity",type:"float",nullable:false})
    quantity:number;

    @Column({name:"lote_id",nullable:false})
    loteId:string;

    @Column({name:"amount",type:"float",nullable:false})
    amount:number;

    @Column({name:"create_at",nullable:false})
    createAt:string;

    @Column({name:"sale_id",nullable:false})
    saleId:number;

    @Column({name:"product_id",nullable:false})
    productId:number;

    @Column({name:"presentation_id",nullable:false})
    presentationId:number;

    @Column({name:"type",nullable:false})//ORIGINAL OR MODIFIED
    type:string;    

    @Column({name:"sub_sale_id_identifier",nullable:true}) // to comparative
    subSaleIdIdentifier:number;

    @Column({name:"devolution_request_id",nullable:true})
    devolutionRequestId:number;

}