import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./Product";


@Entity({name:"entrances_drief"})
export class EntranceDrief{

    @PrimaryGeneratedColumn({name:"id"})
    id:number;

    @Column()
    proveedor_id:number;

    @Column({name:"lote_proveedor"})
    loteProveedor:string;

    @ManyToOne(type => Product, product => product.id)
    product: Product;
   
    @Column()
    date:string;

    @Column()
    observations:string;

    @Column()
    quantity:string;

    @Column()
    quality:boolean;
    
    @Column()
    expiration:boolean;
    
    @Column()
    transport:boolean;
    
    @Column({name:"strange_material"})
    strangeMaterial:boolean;

    @Column()
    raw_material:boolean;

    @Column()
    paking: boolean;
    
    @Column()
    odor:boolean;

    @Column()
    color:boolean;
    
    @Column()
    texture:boolean;
    
    @Column()
    weight: boolean;

    @Column({name:"is_pz"})
    isPz:boolean;
}
