import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable, JoinColumn, OneToOne } from "typeorm";
import { PropertiesPackaging } from "./Properties.Packaging";
import { ProductRovianda } from "./Product.Rovianda";
import { SubOrder } from "./SubOrder.Sale.Seller";
import { SellerInventory } from "./Seller.Inventory";
import { SubSales } from "./Sub.Sales";
import { Devolution } from "./Devolution";

@Entity({ name: "presentation_products" })
export class PresentationProducts {
    @PrimaryGeneratedColumn({ name: "presentation_id" })
    id: number;

    @Column({ name: "presentation" })
    presentation: number;

    @Column({ name: "type_presentation" })
    presentationType: string;

    @Column({ name: "price_presentation_public" ,type:"float"})
    presentationPricePublic: number;

    @Column({ name: "price_presentation_min" ,type:"float"})
    presentationPriceMin: number;

    @Column({ name: "price_presentation_liquidation" ,type:"float"})
    presentationPriceLiquidation: number;

    @Column()
    status: boolean;

    @OneToMany(type => PropertiesPackaging, propertiesPackaging => propertiesPackaging.presentation)
    propertiesPackaging: PropertiesPackaging[];

    @ManyToOne(type => ProductRovianda, productRovianda => productRovianda.presentationProducts)
    @JoinColumn({name:"product_rovianda_id"})
    productRovianda: ProductRovianda;

    @OneToMany(type=> SubOrder,subOrder=>subOrder.presentation,{eager:false})
    saleRequest: SubOrder[];

    @OneToMany(type=>SellerInventory,sellerInv=>sellerInv.presentation)
    sellerInventory:SellerInventory[];

    @OneToMany(type=>SubSales,subSale=>subSale.presentation)
    subSales:SubSales[];

    @Column({name:"type_price"})
    typePrice:string;

    @Column({name:"key_sae"})
    keySae:string;

    @OneToMany(type=>Devolution,devolution=>devolution.presentationProduct)
    devolutions:Devolution[];

    @Column({name:"uni_med",default:"KG"})
    uniMed:string;

    @Column({name:"key_altern",nullable:true})
    keyAltern:string;
    @Column({name:"type_product"})
    typeProduct:string;

    @Column({name:"esq_key",default:2})
    esqKey: number;

    @Column({name:"esq_description",default:"0% IVA"})
    esqDescription: string;
}