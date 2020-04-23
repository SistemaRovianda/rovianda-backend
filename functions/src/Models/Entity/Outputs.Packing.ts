import { PrimaryGeneratedColumn, Column, Entity, JoinColumn, OneToOne, ManyToOne  } from "typeorm";
import { User } from "./Users";
import { Product } from "./Product";


@Entity({name:"outputs_packing"})
export class OutputsPacking{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    lote_proveedor:string;

    @Column()
    date:string;

    @Column()
    quantity:string;

    @OneToOne(type => User )
    @JoinColumn()
    operator_outlet: User;

    @ManyToOne(type=>Product, product=>product.outputsPacking,{eager:true, onDelete:"SET NULL"})
    product:Product; 
}