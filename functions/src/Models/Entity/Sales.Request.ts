import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { SaleSeller } from "./Sale.Seller";
import { PresentationProducts } from "./Presentation.Products";

@Entity({name:"sales_request"})
export class SalesRequest{

    @PrimaryGeneratedColumn({name:"request_id"})
    requestId:number;

    @Column({name:"user_id"})
    userId:string;

    @Column()
    vendedor:string;

    @Column()
    status:boolean;   

    @ManyToOne(type=>SaleSeller, saleSeller=>saleSeller.saleRequest, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"sale_seller_id"})
    saleSeller:SaleSeller;

    @Column({name:"produtc_id"})
    productId:number;

    @ManyToOne(type=>PresentationProducts, presentation=>presentation.saleRequest, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"presentation_id"})
    presentation:PresentationProducts;

    @Column()
    units:number;

    @Column()
    date: string;
}