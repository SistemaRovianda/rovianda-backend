import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, ManyToMany  } from "typeorm";
import { Fidges } from './Fidges';


@Entity({name:"cooling"})
export class Cooling{

    @PrimaryGeneratedColumn()
    fidge_id:number;

    @Column()
    lote_interno:string;

    @Column()
    lote_proveedor:string;

    @Column()
    quantity:string;

    @Column()
    userid:string;

    @Column()
    status:string;

    @Column()
    raw_material:string;

    @Column()
    opening_date:string;

    @Column()
    closing_date:string;
    
    @ManyToOne(type=>Fidges, fidge=>fidge.coolings,{eager:true, onDelete:"SET NULL"})
    fidge:Fidges;

    //@ManyToOne(type=>Category,category=>category.products,{eager:true, onDelete:"SET NULL"})
    //category:Category;
}