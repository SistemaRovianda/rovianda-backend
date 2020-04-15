import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany, JoinTable  } from "typeorm";
import { Product } from './Product';


@Entity({name:"outputs_drief"})
export class OutputsDrief{

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(type=>Product, product=>product.outputsDrief,{eager:true, onDelete:"SET NULL"})
    product:Product; 

    @Column()
    lote_proveedor:string;

    @Column()
    date:string;   

    @Column()
    observations:string;

    //@ManyToOne(type=>Product,product=>product.productSale, {eager:true, onDelete:"SET NULL"})
    //product:Product;

    //@ManyToOne(type=>Category,category=>category.products,{eager:true, onDelete:"SET NULL"})
    //category:Category;
}