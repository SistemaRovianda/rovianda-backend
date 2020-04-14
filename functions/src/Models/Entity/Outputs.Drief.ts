import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany, JoinTable  } from "typeorm";
import { Product } from './Product';


@Entity({name:"outputs_drief"})
export class OutputsDrief{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    lote_proveedor:string;

    @Column()
    date:string;

    @ManyToOne(type=>Product, product=>product.outputsDrief, {cascade:true ,eager:true, onDelete:"SET NULL"})
    product:Product;    

    @Column()
    observations:string;

    //@ManyToOne(type=>Product,product=>product.productSale, {eager:true, onDelete:"SET NULL"})
    //product:Product;

    //@ManyToOne(type=>Category,category=>category.products,{eager:true, onDelete:"SET NULL"})
    //category:Category;
}