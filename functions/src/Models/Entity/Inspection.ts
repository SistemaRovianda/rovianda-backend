
import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn} from "typeorm";
import { Packaging } from "./Packaging";

@Entity({name:"inspection"})
export class Inspection{

    @PrimaryGeneratedColumn({name:"inspection_id"})
    id:number;

    @Column({name:"lot_id"})
    lotId:string;

    @Column({name:"expiration_date"})
    expirationDate:string;

    @OneToOne(type => Packaging, packaging=>packaging.productId)
    @JoinColumn()
    productId:string;
    
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

    @Column({name:"name_elaborated"})
    nameElaborated:string;

    @Column({name:"job_elaborated"})
    jobElaborated:string;

    @Column({name:"name_verify"})
    nameVerify:string;

    @Column({name:"job_verify"})
    jobVerify:string;

}


