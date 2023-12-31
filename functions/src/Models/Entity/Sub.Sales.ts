import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Sale } from "./Sales";
import { ProductRovianda } from "./Product.Rovianda";
import { PresentationProducts } from "./Presentation.Products";
import { PreSale } from "./PreSale";


@Entity({name:"sub_sales"})
export class SubSales{

    constructor(){
        this.createAt = new Date().toISOString();
    }

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

    @Column({type:"float"})
    quantity:number;

    @Column({name:"lote_id"})
    loteId:string;

    @Column()
    amount:number;

    @Column({name:"create_at",nullable:true})
    createAt:string;

    @Column({name:"app_sub_sale_id",nullable:true})
    appSubSaleId:number;

    @ManyToOne(()=>PreSale,presale=>presale.subSales)
    @JoinColumn({name:"pre_sale_id"})
    preSale:PreSale;
    
}