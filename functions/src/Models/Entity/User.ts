import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn, OneToMany } from "typeorm";
import { Roles } from './Roles';
import { EntranceMeat } from "./Entrances.Meat";
import { Maintenance } from "./Maintenance";
import { Formulation } from "./Formulation";
import { EntrancePacking } from "./Entrances.Packing";
import { OrderSeller } from "./Order.Seller";
import { Packaging } from "./Packaging";
import { SellerInventory } from "./Seller.Inventory";
import { Sale } from "./Sales";
import { SellerOperation } from "./Seller.Operations";
import { Client } from "./Client";
import { Debts } from "./Debts";

@Entity({name:"users"})
export class User{

    @PrimaryColumn()
    id:string;

    @Column()
    saeKey:number;

    @Column()
    name:string;

    @Column()
    email:string;

    @Column()
    job:string;

    @ManyToOne(type=>Roles,roles=>roles.users)
    @JoinColumn({name:"rol"})
    roles:Roles;

    @OneToMany(type =>EntranceMeat, entrancesMeat => entrancesMeat.qualityInspector)
    entrancesMeat:EntranceMeat[];

    @OneToMany(type=> Maintenance,maintenance=>maintenance.user)
    maintenance:Maintenance[];

    @OneToMany(type=> Formulation,formulationVerifit=>formulationVerifit.verifit)
    formulationVerifit:Formulation[];

    @OneToMany(type=> Formulation,formulationMake=>formulationMake.make)
    formulationMake:Formulation[];

    @OneToMany(type=> EntrancePacking,entrancePackingVerifit=>entrancePackingVerifit.verifit)
    entrancePackingVerifit:EntrancePacking[];

    @OneToMany(type=> EntrancePacking,entrancePackinMake=>entrancePackinMake.make)
    entrancePackinMake:EntrancePacking[];

    @OneToMany(type=> OrderSeller,orderSeller=>orderSeller.user,{eager:false})
    saleSeller: OrderSeller[];

    @OneToMany(type=> Packaging,packaging=>packaging.userId)
    packaging:Packaging[];

    @OneToMany(type=>SellerInventory,sellerInv=>sellerInv.seller)
    sellerInventory?:SellerInventory[];

    @OneToMany(type=>Sale,sale=>sale.seller)
    sales:Sale[];

    @OneToMany(type=>SellerOperation,sellerOp=>sellerOp.seller)
    sellerOperations?:SellerOperation[];

    @OneToMany(type=>Client,client=>client.seller)
    clients?:Client[];

    @OneToMany(type=>Debts,debts=>debts.seller)
    debts:Debts[];
}