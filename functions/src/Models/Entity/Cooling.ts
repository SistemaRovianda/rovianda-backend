import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany, JoinColumn  } from "typeorm";
import { Fridge } from './Fridges';
import { Raw } from "./Raw";


@Entity({name:"cooling"})
export class Cooling{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:"lote_interno"})
    loteInterno:string;

    @Column({name:"lote_proveedor"})
    loteProveedor:string;

    @Column()
    quantity:string;

    @Column({name:"userId",nullable:true})
    userId:string;

    @ManyToOne(type=>Fridge, fridge=>fridge.coolings, {eager:true, onDelete:"SET NULL"})
    fridge:Fridge;

    @Column()
    status:string;

    //@JoinColumn({name:"product_id"})
    // @Column({name:"raw_material"})
    // rawMaterial:string;
    @ManyToOne(type=>Raw, raw=>raw.coolings, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"raw_material_id"})
    rawMaterial:Raw;

    @Column({name:"opening_date",nullable:true})
    openingDate:string;

    @Column({name:"closing_date",nullable:true})
    closingDate:string;
    

    //@ManyToOne(type=>Product,product=>product.productSale, {eager:true, onDelete:"SET NULL"})
    //product:Product;

    //@ManyToOne(type=>Category,category=>category.products,{eager:true, onDelete:"SET NULL"})
    //category:Category;
}

