import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { Product } from "./Product";
import { RevisionsOvenProducts } from "./Revisions.Oven.Products";
import { ProductRovianda } from "./Product.Rovianda";
import { Packaging } from "./Packaging";
import { Devolution } from "./Devolution";

@Entity({ name: "oven_products" })
export class OvenProducts {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "estimated_time" })
    stimatedTime: string;

    @ManyToOne(type=> ProductRovianda, productR=>productR.ovenProducts,{eager:true})
    @JoinColumn({name:"product_rovianda_id"})
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

    @Column({ name: "name_elaborated",nullable:true })
    nameElaborated: string;

    @Column({ name: "job_elaborated",nullable:true })
    jobElaborated: string;

    @Column({ name: "name_verify",nullable:true })
    nameVerify: string;

    @Column({ name: "job_verify",nullable:true })
    jobVerify: string;

    @Column({ name: "name_check" ,nullable:true})
    nameCheck: string;

    @Column({ name: "job_check",nullable:true })
    jobCheck: string;

    @OneToMany(type=>RevisionsOvenProducts,ovenProducts=>ovenProducts.ovenProducts)
    revisions:RevisionsOvenProducts[];

    @Column()
    processId:number;

    @Column({name:"observations",nullable:true})
    observations:string;
    // @Column({ name: "new_lote" })
    // newLote: string;
    

    @OneToMany(type=>Packaging,packaging=>packaging.ovenProduct)
    packagings:Packaging[];

    @OneToMany(type=>Devolution,dev=>dev.ovenProduct)
    devolutions:Devolution[];

}