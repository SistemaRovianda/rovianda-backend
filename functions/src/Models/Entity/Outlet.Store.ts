import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, ManyToMany, OneToOne, JoinColumn } from "typeorm";
import { Ingredients } from './Ingredients';
import { Product } from './Product';
import { User } from './Users';

@Entity({name:"outletStore"})
export class OutletStore{

    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(type => Product)
    @JoinColumn()
    product_id: Product;

    @OneToOne(type => User )
    @JoinColumn()
    vendedor_id: User;
    
    @Column()
    amount:number;

    @Column()
    precio:number;

    @Column()
    kilo:number;

}