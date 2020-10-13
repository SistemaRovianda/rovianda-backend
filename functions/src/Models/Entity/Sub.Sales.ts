import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Code, Column } from "typeorm";
import { Sale } from "./Sales";
import { ProductRovianda } from "./Product.Rovianda";
import { PresentationProducts } from "./Presentation.Products";
import { Client } from "./Client";

@Entity({name:"sub_sales"})
export class SubSales{

    @PrimaryGeneratedColumn({name:"sub_sale_id"})
    subSaleId:number;

    @ManyToOne(type=>Sale,sale=>sale.subSales)
    @JoinColumn({name:"sale_id"})
    sale:Sale;

    @ManyToOne(type=>ProductRovianda,product=>product.subSales,{eager:true})
    @JoinColumn({name:"product_id"})
    product:ProductRovianda;

    @ManyToOne(type=>PresentationProducts,pp=>pp.subSales,{eager:true})
    @JoinColumn({name:"presentation_id"})
    presentation:PresentationProducts;

    @Column()
    quantity:number;

    @Column({name:"lote_id"})
    loteId:string;

    @Column()
    amount:number;

}