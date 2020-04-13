import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany  } from "typeorm";
import { Product } from './Product';


@Entity({name:"warehouse_drief"})
export class WarehouseDrief{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    lote_proveedor:string;

    @Column()
    date:string;

    @Column()
    quantity:string;

    @Column()
    is_pz:boolean;

    @Column()
    observations:string;

    @Column()
    status:string;

    @Column()
    opening_date:string;

    @Column()
    closing_date:string;

    @Column()
    user_id:string;

    @ManyToOne(type=>Product, product=>product.warehouseDrief, {eager:true, onDelete:"SET NULL"})
    product:Product;    

    //@ManyToOne(type=>Product,product=>product.productSale, {eager:true, onDelete:"SET NULL"})
    //product:Product;

    //@ManyToOne(type=>Category,category=>category.products,{eager:true, onDelete:"SET NULL"})
    //category:Category;
}