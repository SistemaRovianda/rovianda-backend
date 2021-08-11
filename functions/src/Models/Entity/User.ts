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
import { EntranceDrief } from "./Entrances.Drief";

@Entity({name:"users"})
export class User{

    @PrimaryColumn()
    id:string;

    @Column({default:0})
    saeKey:number;

    @Column()
    name:string;

    @Column()
    email:string;

    @Column()
    job:string;

    @ManyToOne(type=>Roles,roles=>roles.users)
    @JoinColumn({name:"rol_id"})
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

    @OneToMany(type=> OrderSeller,orderSeller=>orderSeller.seller,{eager:false})
    saleSeller: OrderSeller[];

    @OneToMany(type=> Packaging,packaging=>packaging.userId)
    packaging:Packaging[];

    @OneToMany(type=>SellerInventory,sellerInv=>sellerInv.seller)
    sellerInventory:SellerInventory[];

    @OneToMany(type=>Sale,sale=>sale.seller)
    sales:Sale[];

    @OneToMany(type=>SellerOperation,sellerOp=>sellerOp.seller)
    sellerOperations:SellerOperation[];

    @OneToMany(type=>Client,client=>client.seller)
    clientsArr:Client[];

    @OneToMany(type=>Debts,debts=>debts.seller)
    debts:Debts[];

    @Column({nullable:true,name:"warehouse_key_sae"})
    warehouseKeySae:string;

    @Column({name:"status",default:"ACTIVE"})
    status:string;

    @Column({name:"cve",nullable:true})
    cve:string;

    @Column({name:"token",nullable:true})
    token:string;
    // @OneToMany(type=>EntranceDrief,entranceDrief=>entranceDrief.userRecepcion)
    // entrancesDrief:EntranceDrief[];
}