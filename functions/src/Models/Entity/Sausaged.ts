import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import { Defrost } from "./Defrost";
import { Process } from "./Process";
import { Product } from "./Product";
import { ProductRovianda } from "./Product.Rovianda";

@Entity({name:"sausaged"})
export class Sausaged{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    temperature:string;

    @Column()
    date:string;

    @Column({name:"weight_ini"})
    weightIni:string;

    @Column()
    hour1:string;

    @Column({name:"weight_medium"})
    weightMedium:string;

    @Column()
    hour2:string;

    @Column({name:"weight_exit"})
    weightExit:string;

    @Column()
    hour3:string;

    @Column({name:"lote_meat"})
    loteMeat:string;
    
    // @OneToOne(type => Product)
    // @JoinColumn({name:"product_id"})
    // productId:Product;

    // @ManyToOne(type=>Product, productId=>productId.sausaged, {eager:true, onDelete:"SET NULL"})
    // @JoinColumn({name:"product_id"})
    // productId:Product;
    @Column()
    raw:string;

    @ManyToOne(type=>Process,process=>process.sausage)
    @JoinColumn({name:"process_id"})
    process:Process;

    // @OneToOne(type=>Defrost,defrost=>defrost.sausaged,{eager:true})
    // @JoinColumn({name:"defrost_id"})
    // defrost:Defrost;
}


