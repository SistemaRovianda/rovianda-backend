import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";


@Entity({name:"entrances_drief"})
export class EntrancesDrief{

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
    quality:boolean;
    
    @Column()
    expiration:boolean;
    
    @Column()
    transport:boolean;
    
    @Column()
    strange_material:boolean;

    @Column()
    paking: boolean;
    
    @Column()
    color:boolean;
    
    @Column()
    texture:boolean;
    
    @Column()
    weigth: boolean;
}
