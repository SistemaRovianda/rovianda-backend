import { PrimaryGeneratedColumn, Column, Entity, OneToMany, OneToOne, JoinColumn} from "typeorm";
import { Product } from "./Product";
import { RevisionsOvenProducts } from './Revisions.Oven.Products';


@Entity({name:"oven_products"})
export class OvenProducts{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:"estimated_time"})
    estimatedTime:string;

    @Column({name:"new_lote"})
    new_lote:string;

    @Column()
    pcc:string;

    @Column()
    date:string;

    @Column()
    status:string;

    @Column({name:"name_elaborated"})
    nameElaborated:string;

    @Column({name:"job_elaborated"})
    jobElaborated:string;

    @Column({name:"name_verify"})
    nameVerify:string;

    @Column({name:"job_verify"})
    jobVerify:string;

    @OneToOne(type => Product)
    @JoinColumn({name:"product_id"})
    productId: Product;

    @OneToMany(type=> RevisionsOvenProducts,revisionsOvenProducts=>revisionsOvenProducts.ovenProducts,{eager:false})
    revisionsOvenProducts: RevisionsOvenProducts[];

}