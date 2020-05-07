import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { Product } from "./Product";

@Entity({ name: "oven_products" })
export class OvenProducts {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "estimated_time" })
    stimatedTime: string;

    @OneToOne(type=> Product, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"product_id"})
    product:Product;
 
    @Column({ name: "new_lote" })
    newLote: string;

    @Column({ name: "pcc" })
    pcc: string;

    @Column({ name: "date" })
    date: string;

    @Column({ name: "status" })
    status: string;

    @Column({ name: "name_elaborated" })
    nameElaborated: string;

    @Column({ name: "job_elaborated" })
    jobElaborated: string;

    @Column({ name: "name_verify" })
    nameVerify: string;

    @Column({ name: "job_verify" })
    jobVerify: string;

    // @OneToMany(type=> RevisionsOvenProducts,revisionsOvenProducts=>revisionsOvenProducts.ovenProducts,{eager:false})
    // revisionsOvenProducts: RevisionsOvenProducts[];
    
}