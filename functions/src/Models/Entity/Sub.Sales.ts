import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Sale } from "./Sales";
import { ProductRovianda } from "./Product.Rovianda";
import { PresentationProducts } from "./Presentation.Products";


@Entity({name:"sub_sales"})
export class SubSales{

    @PrimaryGeneratedColumn({name:"sub_sale_id"})
    subSaleId:number;

    @ManyToOne(type=>Sale,sale=>sale.subSales)
    @JoinColumn({name:"sale_id"})
    sale:Sale;

    @ManyToOne(type=>ProductRovianda,product=>product.subSales)
    @JoinColumn({name:"product_id"})
    product:ProductRovianda;

    @ManyToOne(type=>PresentationProducts,pp=>pp.subSales)
    @JoinColumn({name:"presentation_id"})
    presentation:PresentationProducts;

    @Column()
    quantity:number;

    @Column({name:"lote_id"})
    loteId:string;

    @Column()
    amount:number;

}