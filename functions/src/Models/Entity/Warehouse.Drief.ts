import { PrimaryGeneratedColumn, Column, Entity, JoinColumn, OneToOne, ManyToOne, JoinTable  } from "typeorm";
import { Product } from './Product';


@Entity({name:"warehouse_drief"})
export class WarehouseDrief{

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(type => Product,product=>product.warehouseDrief,{eager:true})
    product:Product;

    @Column({name:"lote_proveedor"})
    loteProveedor:string;

    @Column()
    date:string;

    @Column()
    quantity:string;

    @Column({name:"is_pz"})
    isPz:boolean;

    @Column()
    observations:string;

    @Column()
    status:string;

    @Column({name:"opening_date",nullable:true})
    openingDate:string;

    @Column({name:"closing_date",nullable:true})
    closingDate:string;

    @Column({name:"user_id"})
    userId:string;

    // @OneToOne(type=>Product,{cascade:true})
    // @JoinColumn()
    // product:Product;
    
    // @OneToMany(type => Product, product => product.id)
    // productId: Product[];
}