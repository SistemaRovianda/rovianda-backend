import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { JoinAttribute } from "typeorm/query-builder/JoinAttribute";
import { ProductRovianda } from "./Product.Rovianda";
import { PresentationProducts } from "./Presentation.Products";

@Entity({name:"seller_inventory"})
export class SellerInventory{

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(type=>User,user=>user.sellerInventory)
    @JoinColumn({name:"seller_id"})
    seller:User;

    @Column()
    quantity:number;

    @ManyToOne(type=>ProductRovianda,prorov=>prorov.sellerInventory)
    product:ProductRovianda;

    @Column({name:"lote_id"})
    loteId:string;

    @Column({name:"date_entrance"})
    dateEntrance:string;

    @ManyToOne(type=>PresentationProducts,pp=>pp.presentation)
    @JoinColumn({name:"presentation_id"})
    presentation:PresentationProducts;

    @Column({type:"float"})
    weigth:number;
}