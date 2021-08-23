import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { ProductRovianda } from './Product.Rovianda';
import { Process } from './Process';
import { OvenProducts } from './Oven.Products';
import { Product } from "./Product";
import { Defrost } from "./Defrost";
import { Formulation } from "./Formulation";

@Entity({name:"reprocessing"})
export class Reprocessing{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    date:string;

    @ManyToOne(type=>Defrost,defrost=>defrost.reprocesings,{eager:true,nullable:true})
    @JoinColumn({name:"defrost_id"})
    defrost:Defrost;

    @Column()
    allergens:string;

    @Column({type:"float"})
    weigth:number;

    @Column({type:"float",name:"weight_merm"})
    weightMerm:number;

    @Column()
    active:boolean;

    @Column({nullable:true})
    used:boolean;

    @ManyToOne(type=>Process,process=>process.reprocesings)
    @JoinColumn({name:"process_id"})
    process:Process;

    @Column({name:"process_used",nullable:true})
    processUsed:string;

    @Column({name:"weigth_used",nullable:true})
    weigthUsed:string;

    @Column({name:"date_used",nullable:true})
    dateUsed:string;

    @Column({name:"packaging_product_name",nullable:true})
    packagingProductName:string;

    @Column({name:"lot_reprocesing_oven",nullable:true})
    packagingReprocesingOvenLot:string;

    @Column({nullable:true})
    comment:string;

}