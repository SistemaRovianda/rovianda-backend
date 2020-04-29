import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany  } from "typeorm";
import { Fridge } from './Fridges';


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

    @Column({name:"userId"})
    userId:string;

    @ManyToOne(type=>Fridge, fridge=>fridge.coolings, {eager:true, onDelete:"SET NULL"})
    fridge:Fridge;

    @Column()
    status:string;

    @Column({name:"raw_material"})
    rawMaterial:string;

    @Column({name:"opening_date",nullable:true})
    openingDate:string;

    @Column({name:"closing_date",nullable:true})
    closingDate:string;
    

    //@ManyToOne(type=>Product,product=>product.productSale, {eager:true, onDelete:"SET NULL"})
    //product:Product;

    //@ManyToOne(type=>Category,category=>category.products,{eager:true, onDelete:"SET NULL"})
    //category:Category;
}

