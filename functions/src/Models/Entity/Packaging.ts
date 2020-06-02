import { PrimaryGeneratedColumn, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProductRovianda } from './Product.Rovianda';

@Entity({name:"packaging"})
export class Packaging{

    @PrimaryGeneratedColumn()
    id:number;
    
    @ManyToOne(type => ProductRovianda, productRovianda=>productRovianda.packaging)
    @JoinColumn({name:"product_id"})
    productId:ProductRovianda;

    @Column({name:"register_date"})
    registerDate:string;

    @Column({name:"lot_id"})
    lotId:number;

    @Column()
    expiration:string;
    
    @Column()
    pieces:number;

    @Column()
    packs:number;

    @Column()
    weight:number;

    @Column()
    observations:string;
}







