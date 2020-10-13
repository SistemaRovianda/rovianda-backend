import { Entity, ManyToMany, JoinColumn, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable } from "typeorm";
import { Product } from "./Product";
import { Packaging } from './Packaging';
import { Process } from "./Process";
import { Formulation } from "./Formulation";
import { OvenProducts } from "./Oven.Products";
import { PresentationProducts } from "./Presentation.Products";
import { Inspection } from "./Inspection";
import { Grinding } from "./Grinding";
import { Conditioning } from "./Conditioning";
import { Tenderized } from "./Tenderized";
import { SubOrder } from "./SubOrder.Sale.Seller";
import { SellerInventory } from "./Seller.Inventory";
import { SubSales } from "./Sub.Sales";
import { Sausaged } from "./Sausaged";

@Entity({ name: "products_rovianda" })
export class ProductRovianda {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    status: boolean;

    @ManyToMany(type => Product, product => product.productRovianda,{cascade:true})
    @JoinTable({name:"ingredients"})
    ingredients: Product[];

    @OneToMany(type => PresentationProducts, presentationProducts => presentationProducts.productRovianda,{cascade:true})
    presentationProducts: PresentationProducts[];

    @OneToMany(type => Packaging, packaging => packaging.productId)
    packaging: Packaging[];

    @OneToMany(type=>Process, process=>process.product)
    process:Process[];

    @OneToMany(type=>Grinding, grinding=>grinding.product)
    grinding:Grinding[];

    @OneToMany(type=>Conditioning, conditioning=>conditioning.productId)
    conditioning:Conditioning[];

    @OneToMany(type=>Sausaged, sausaged=>sausaged.productId)
    sausaged:Sausaged[];

    @OneToMany(type=>Tenderized, tenderized=>tenderized.productId)
    tenderized:Tenderized[];

    @OneToMany(type=> Formulation,formulation=>formulation.productRovianda,{eager:false})
    formulation: Formulation[];

    @OneToMany(type=> OvenProducts,ovenProducts=>ovenProducts.product,{eager:false})
    ovenProducts: OvenProducts[];

    @OneToMany(type=> Inspection,inspection=>inspection.productId,{eager:false})
    inspection: Inspection[];

    @OneToMany(type=>SubOrder,subOrder=>subOrder.product)
    subOrdersSeller:SubOrder[];

    @Column({name:"img_s3"})
    imgS3:string;

    @OneToMany(type=>SellerInventory,sellerInv=>sellerInv.product)
    sellerInventory?:SellerInventory[];

    @OneToMany(type=>SubSales,subSale=>subSale.product)
    subSales:SubSales[];

}