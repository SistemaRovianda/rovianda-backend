import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from "typeorm";
import { SubOrder } from "./SubOrder.Sale.Seller";

@Entity({name: "suborder_metadata"})
export class SubOrderMetadata{

    @PrimaryGeneratedColumn({name:"sub_order_metadata_id"})
    subOrderMetadataId:number;

    @ManyToOne(type=>SubOrder,subOrder=>subOrder.subOrderMetadata)
    @JoinColumn({name:"sub_order_id"})
    subOrder:SubOrder;

    @Column({name:"lote_id",nullable:false})
    loteId:string;

    @Column({name:"output_date",nullable:false})
    outputDate:string;

    @Column({nullable:false})
    quantity: number;

    @Column({type:"float"})
    weigth:number;

}