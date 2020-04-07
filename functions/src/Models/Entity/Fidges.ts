import { PrimaryGeneratedColumn, Column, Entity, OneToMany  } from "typeorm";
import { Cooling } from './Cooling';


@Entity({name:"fidges"})
export class Fidges{

    @PrimaryGeneratedColumn()
    fidge_id:number;

    @Column()
    temo:string;
    
    @OneToMany(type=> Cooling,cooling=>cooling.fidge)
    coolings?: Cooling[];

    //@ManyToOne(type=>Category,category=>category.products,{eager:true, onDelete:"SET NULL"})
    //category:Category;
}