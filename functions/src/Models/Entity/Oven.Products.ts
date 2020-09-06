import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { Product } from "./Product";
import { RevisionsOvenProducts } from "./Revisions.Oven.Products";
import { ProductRovianda } from "./Product.Rovianda";

@Entity({ name: "oven_products" })
export class OvenProducts {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "estimated_time" })
    stimatedTime: string;

    @ManyToOne(type=> ProductRovianda, productR=>productR.ovenProducts)
    @JoinColumn({name:"product_id"})
    product:ProductRovianda;
 
    @Column({ name: "new_lote" })
    newLote: string;

    @Column({ name: "pcc" })
    pcc: string;

    @Column({ name: "oven" })
    oven: number;

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

    @Column({ name: "name_check" })
    nameCheck: string;

    @Column({ name: "job_check" })
    jobCheck: string;

    @OneToMany(type=>RevisionsOvenProducts,ovenProducts=>ovenProducts.ovenProducts)
    revisions:RevisionsOvenProducts[];

    @Column()
    processId:number;

    // @Column({ name: "new_lote" })
    // newLote: string;

}