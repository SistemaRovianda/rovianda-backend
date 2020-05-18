import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProductRovianda } from './Product.Rovianda';

@Entity({name:"packaging"})
export class Packaging{

    @PrimaryGeneratedColumn()
    id:number;

    @OneToMany(type => ProductRovianda,productRovianda => productRovianda.pack)
    productId:ProductRovianda[];
    
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







