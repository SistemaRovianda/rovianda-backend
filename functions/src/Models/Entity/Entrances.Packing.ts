import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne, OneToOne } from "typeorm";
import { Product } from "./Product";
import { User } from "./User";


@Entity({name:"entrances_packing"})
export class EntrancePacking{

    @PrimaryGeneratedColumn({name:"id"})
    id:number;

    @Column()
    proveedor:string;

    @Column({name:"lote_proveedor"})
    loteProveedor:string;

    @ManyToOne(type => Product, product => product.entrancePacking)
    product: Product;
   
    @Column()
    date:string;

    @Column()
    quantity:string;

    @Column()
    observations: string;

    @Column({name:"is_pz"})
    isPz:boolean;

    @Column()
    quality:boolean;

    @Column({name:"strange_material"})
    strangeMaterial:boolean;

    @Column()
    paking:boolean;

    @Column()
    transport:boolean;

    @ManyToOne(type=>User, verifit=>verifit.entrancePackingVerifit, {eager:true, onDelete:"SET NULL"})
    verifit:User;

    @ManyToOne(type=>User, make=>make.entrancePackinMake, {eager:true, onDelete:"SET NULL"})
    make:User;
}
