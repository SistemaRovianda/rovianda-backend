import { PrimaryGeneratedColumn, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ProductRovianda } from './Product.Rovianda';
import { PropertiesPackaging } from './Properties.Packaging';
import { User } from './User';

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
    lotId:string;

    @Column()
    expiration:string;

    @ManyToOne(type=>User, userId=>userId.packaging, {eager:true, onDelete:"SET NULL"})
    userId:User;

    @Column()
    active:boolean;

}







