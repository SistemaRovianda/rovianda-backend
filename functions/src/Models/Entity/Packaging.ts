import { PrimaryGeneratedColumn, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ProductRovianda } from './Product.Rovianda';
import { PropertiesPackaging } from './Properties.Packaging';

@Entity({name:"packaging"})
export class Packaging{

    @PrimaryGeneratedColumn()
    id:number;

    @OneToMany(type => PropertiesPackaging, propertiesPackaging => propertiesPackaging.packagingId)
    propertiesPackaging: PropertiesPackaging[];
    
    @ManyToOne(type => ProductRovianda, productRovianda=>productRovianda.packaging)
    @JoinColumn({name:"product_id"})
    productId:ProductRovianda;

    @Column({name:"register_date"})
    registerDate:string;
    
    @Column({name:"lot_id"})
    lotId:number;

    @Column()
    expiration:string;

    @Column({name: "name_elabored", nullable: true})
    nameElabored: string;

    @Column({name: "job_elabored", nullable: true})
    jobElabored: string;

    @Column({name: "name_verify", nullable: true})
    nameVerify: string;

    @Column({name: "job_verify", nullable: true})
    jobVerify: string;

}







