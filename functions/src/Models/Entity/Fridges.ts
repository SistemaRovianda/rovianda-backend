import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany  } from "typeorm";
import { Cooling } from './Cooling';


@Entity({name:"fridges"})
export class Fridges{

    @PrimaryGeneratedColumn()
    fridge_id:number;

    @Column()
    temo:string;
    
    @OneToMany(type=> Cooling,cooling=>cooling.fridge)
    coolings: Cooling[];

    //@OneToMany(type=>ProductSale,productSale=>productSale.product)
    //productSale:ProductSale[];

    //@ManyToOne(type=>Category,category=>category.products,{eager:true, onDelete:"SET NULL"})
    //category:Category;
}