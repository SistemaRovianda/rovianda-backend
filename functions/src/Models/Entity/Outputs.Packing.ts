import { PrimaryGeneratedColumn, Column, Entity, JoinColumn, OneToOne, ManyToOne  } from "typeorm";

import { Product } from "./Product";


@Entity({name:"outputs_packing"})
export class OutputsPacking{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:"lote_proveedor"})
    loteProveedor:string;

    @Column()
    date:string;

    @Column()
    quantity:number;

    operatorOutlet: string;

    @ManyToOne(type=>Product, product=>product.warehousePacking,{eager:true, onDelete:"SET NULL"})
    product:Product; 
}