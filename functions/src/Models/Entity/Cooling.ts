import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany  } from "typeorm";
import { Fridges } from './Fridges';


@Entity({name:"cooling"})
export class Cooling{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    lote_interno:string;

    @Column()
    lote_proveedor:string;

    @Column()
    quantity:string;

    @Column()
    userid:string;

    @ManyToOne(type=>Fridges, fridge=>fridge.coolings, {eager:true, onDelete:"SET NULL"})
    fridge:Fridges;

    @Column()
    status:string;

    @Column()
    raw_material:string;

    @Column()
    opening_date:string;

    @Column()
    closing_date:string;
    

    //@ManyToOne(type=>Product,product=>product.productSale, {eager:true, onDelete:"SET NULL"})
    //product:Product;

    //@ManyToOne(type=>Category,category=>category.products,{eager:true, onDelete:"SET NULL"})
    //category:Category;
}