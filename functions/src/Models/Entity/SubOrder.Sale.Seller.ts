import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { OrderSeller } from "./Order.Seller";
import { PresentationProducts } from "./Presentation.Products";
import { ProductRovianda } from "./Product.Rovianda";
import { SubOrderMetadata } from "./SubOrder.Sale.Seller.Metadata";

@Entity({name:"suborders"})
export class SubOrder{

    @PrimaryGeneratedColumn({name:"suborder_id"})
    subOrderId:number;

    @ManyToOne(type=>OrderSeller,orderSeller=>orderSeller.subOrders)
    @JoinColumn({name:"order_seller_id"})
    orderSeller:OrderSeller;

    @ManyToOne(type=>ProductRovianda, productRovianda=>productRovianda.subOrdersSeller, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"product_id"})
    productRovianda:ProductRovianda;

    @ManyToOne(type=>PresentationProducts, presentation=>presentation.saleRequest, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"presentation_id"})
    presentation:PresentationProducts;

    @Column({type:"float"})
    units:number;

    @OneToMany(type=>SubOrderMetadata,metadata=>metadata.subOrder,{eager:true,cascade:true,onDelete:"SET NULL"})
    subOrderMetadata:SubOrderMetadata[];

    @Column({name:"type_price"})
    typePrice:string;

    @Column()
    active:boolean;

    @Column({type:"float"})
    weight:number;

    @Column({name:"observations",nullable:true})
    observations:string;

    @Column({name:"out_of_stock",default:false})
    outOfStock:boolean;

}