import { PrimaryGeneratedColumn, Column, Entity, JoinColumn, OneToOne, ManyToOne, JoinTable  } from "typeorm";
import { Product } from './Product';


@Entity({name:"warehouse_drief"})
export class WarehouseDrief{

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(type=>Product,product=>product.warehouseDrief, {eager:true, onDelete:"SET NULL"})
    product:Product;

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

    // @OneToOne(type=>Product,{cascade:true})
    // @JoinColumn()
    // product:Product;
    
    // @OneToMany(type => Product, product => product.id)
    // productId: Product[];
}