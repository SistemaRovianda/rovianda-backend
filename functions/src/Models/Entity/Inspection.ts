
import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import { Packaging } from "./Packaging";
import { ProductRovianda } from './Product.Rovianda';

@Entity({name:"inspection"})
export class Inspection{

    @PrimaryGeneratedColumn({name:"inspection_id"})
    id:number;

    @Column({name:"lot_id"})
    lotId:string;

    @Column({name:"expiration_date"})
    expirationDate:string;

    // @OneToOne(type => Packaging, packaging=>packaging.productId)
    // @JoinColumn()
    // productId:string;

    @ManyToOne(type=>ProductRovianda, productId=>productId.inspection, {eager:true, onDelete:"SET NULL"})
    productId:ProductRovianda;

    
    @Column({name:"number_packages"})
    numberPackages:string;

    @Column()
    observations:string;

    @Column({name:"packaging_control"})
    packagingControl:boolean;

    @Column({name:"foreing_matter"})
    foreingMatter:boolean;

    @Column()
    transport:boolean;

    @Column({name:"weight_per_piece"})
    weightPerPiece:boolean;

    @Column()
    temperature:boolean;

    @Column()
    odor:boolean;

    @Column()
    colour:boolean;

    @Column()
    texture:boolean;

    @Column({name:"name_elaborated",nullable:true})
    nameElaborated:string;

    @Column({name:"job_elaborated",nullable:true})
    jobElaborated:string;

    @Column({name:"name_verify",nullable:true})
    nameVerify:string;

    @Column({name:"job_verify",nullable:true})
    jobVerify:string;

    @Column({name:"process_id"})
    processId:number;

    @Column({name:"user_inspector",nullable:true})
    userIspector:string;

    @Column({name:"presentation_id"})
    presentationId:number;
}


