import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Process } from "./Process";
import { ProductRovianda } from "./Product.Rovianda";
import { User } from "./User";

@Entity({name:"sub_product"})
export class SubProductToOven{

    @PrimaryGeneratedColumn({name:"sub_product_id"})
    subProductId:number;

    @ManyToOne(type=>Process,process=>process.subProductsToOven,{nullable:false})
    @JoinColumn({name:"process_id"})
    process:Process;

    @ManyToOne(type=>ProductRovianda,productRovianda=>productRovianda.subProductsOvens,{nullable:false})
    @JoinColumn({name:"product_rovianda_id"})
    productRovianda:ProductRovianda;

    @Column({name:"quantity",type:"float"})
    quantity:number;

    @Column({name:"observations"})
    observations:string;
    
    @Column({name:"create_at"})
    createAt:string;

    @Column({name:"status"})
    status:string;

    @ManyToOne(type=>User,user=>user.subProductsToOven,{nullable:false})
    @JoinColumn({name:"sub_product_user_creator"})
    subProductUserCreator:User;

    @Column({name:"last_modification"})
    lastModification:string;

    @Column({name:"user_modified_id"})
    userModified:string;
}