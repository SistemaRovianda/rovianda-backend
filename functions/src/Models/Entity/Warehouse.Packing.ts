
import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./Product";

@Entity({name:"warehouse_packing"})
export class WarehousePacking{

    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(type=>Product,product=>product.warehousePacking, {eager:true, onDelete:"SET NULL"})
    product:Product;

    @Column()
    lote_proveedor: string;
    
    @Column()
    date: string;

    @Column()
    quantity: string;

    @Column()
    is_pz: string;

    @Column()
    user_id: string;

    @Column()
    observations: string;

    @Column()
    status: string;

    @Column()
    opening_date: string;

    @Column()
    closing_date: string;
}