import { PrimaryGeneratedColumn, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OvenProducts } from './Oven.Products';
import { ProductRovianda } from './Product.Rovianda';
import { PropertiesPackaging } from './Properties.Packaging';
import { User } from './User';

@Entity({name:"packaging"})
export class Packaging{

    @PrimaryGeneratedColumn()
    id:number;

    @OneToMany(type => PropertiesPackaging, propertiesPackaging => propertiesPackaging.packaging,{cascade:true})
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

    @ManyToOne(type=>OvenProducts,ovenP=>ovenP.packagings,{nullable:true})
    @JoinColumn({name:"oven_product_id"})
    ovenProduct:OvenProducts;

}







