import { PrimaryGeneratedColumn, Column, Entity, JoinColumn, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import { ProductRovianda } from './Product.Rovianda';
import { Inspection } from './Inspection';
import { PropertiesPackaging } from './Properties.Packaging';

@Entity({name:"packaging"})
export class Packaging{

    @PrimaryGeneratedColumn()
    id:number;

    @OneToMany(type => PropertiesPackaging, propertiesPackaging => propertiesPackaging.packaging)
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
    
    @Column({name:"name_elabored"})
    nameElabored:string;

    @Column({name:"job_elabored"})
    jobElabored:string;

    @Column({name:"name_verify"})
    nameVerify:string;

    @Column({name:"job_verify"})
    jobVerify:string;
}







