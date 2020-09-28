import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { PropertiesPackaging } from "./Properties.Packaging";
import { ProductRovianda } from "./Product.Rovianda";
import { SubOrder } from "./SubOrder.Sale.Seller";
import { SellerInventory } from "./Seller.Inventory";
import { SubSales } from "./Sub.Sales";

@Entity({ name: "presentation_products" })
export class PresentationProducts {
    @PrimaryGeneratedColumn({ name: "presentation_id" })
    id: number;

    @Column({ name: "presentation" })
    presentation: number;

    @Column({ name: "type_presentation" })
    presentationType: string;

    @Column({ name: "price_presentation" })
    presentationPrice: string;

    @Column()
    status: boolean;

    @OneToMany(type => PropertiesPackaging, propertiesPackaging => propertiesPackaging.presentation)
    propertiesPackaging: PropertiesPackaging[];

    @ManyToMany(type => ProductRovianda, productRovianda => productRovianda.presentationProducts)
    @JoinTable({
        name: "products_rovianda_presentation",
        joinColumn: {name: "presentation_id"},
        inverseJoinColumn: {name: "product_id"}
    })
    productsRovianda: ProductRovianda[];

    @OneToMany(type=> SubOrder,subOrder=>subOrder.presentation,{eager:false})
    saleRequest: SubOrder[];

    @OneToMany(type=>SellerInventory,sellerInv=>sellerInv.presentation)
    sellerInventory:SellerInventory[];

    @OneToMany(type=>SubSales,subSale=>subSale.presentation)
    subSales:SubSales[];
}