
import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./Product";

@Entity({name:"warehouse_packing"})
export class WarehousePacking{

    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(type=>Product,product=>product.warehousePacking)
    product:Product;

    @Column({name:"lote_proveedor"})
    loteProveedor: string;
    
    @Column()
    date: string;

    @Column()
    quantity: string;

    @Column({name:"is_pz"})
    isPz: boolean;

    @Column({name:"user_id"})
    userId: string;

    @Column()
    observations: string;

    @Column()
    status: string;

    @Column({name:"opening_date",nullable:true})
    openingDate: string;

    @Column({name:"closing_date",nullable:true})
    closingDate: string;
}