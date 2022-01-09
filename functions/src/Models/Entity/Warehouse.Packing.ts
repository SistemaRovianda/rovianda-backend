
import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Product } from "./Product";
import { OutputsPacking } from "./Outputs.Packing";

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

    @Column({name:"user_id",nullable:true})
    userId: string;

    @Column()
    observations: string;

    @Column()
    status: string;

    @Column({name:"opening_date",nullable:true})
    openingDate: string;

    @Column({name:"closing_date",nullable:true})
    closingDate: string;

    @OneToMany(type => OutputsPacking , outputsPacking => outputsPacking.warehousePacking)
    @JoinColumn({ name: "output_packing_id"})
    outputsPacking: OutputsPacking[];

    @Column({name:"is_box"})
    isBox:boolean;
}