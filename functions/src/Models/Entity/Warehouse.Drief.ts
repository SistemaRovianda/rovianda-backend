
import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { Product } from './Product';

@Entity({name:"warehouse_drief"})
export class WarehouseDrief{

    @PrimaryGeneratedColumn()
    id : number;

    @OneToOne(type => Product)
    @JoinColumn()
    product_id: Product;

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