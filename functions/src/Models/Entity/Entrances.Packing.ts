import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from "typeorm";
import { Product } from "./Product";


@Entity({name:"entrances_packing"})
export class EntrancesPacking{

    @PrimaryGeneratedColumn({name:"id"})
    id:number;

    @Column()
    proveedor:string;

    @Column()
    lote_proveedor:string;

    @OneToMany(type => Product, product => product.id)
    product_id: Product[];
   
    @Column()
    date:string;

    @Column()
    quantity:string;

    @Column()
    observations: string;

    @Column()
    is_pz:boolean;

    @Column()
    quality:boolean;

    @Column()
    strange_material:boolean;

    @Column()
    transport:boolean;
}
