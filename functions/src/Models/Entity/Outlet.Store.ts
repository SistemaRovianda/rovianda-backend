import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, ManyToMany, OneToOne, JoinColumn } from "typeorm";
import { Product } from './Product';
import { User } from './User';

@Entity({name:"outletStore"})
export class OutletStore{

    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(type => Product)
    @JoinColumn({name:"product_id"})
    productId: Product;

    @OneToOne(type => User )
    @JoinColumn({name:"vendor_id"})
    vendedorId: User;
    
    @Column()
    amount:number;

    @Column()
    precio:number;

    @Column()
    kilo:number;

}