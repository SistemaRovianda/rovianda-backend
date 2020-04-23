import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn} from "typeorm";
import { Entrances_Meat } from "./Entrances.Meat"
import { Grinding } from './Grinding';
import { User } from './Users';
import { Tenderized } from './Tenderized';
import { Conditioning } from './Conditioning';
import { Sausaged } from './Sausaged';
import { Product } from './Product';

@Entity({name:"process"})
export class Process{

    @PrimaryGeneratedColumn()
    id:number;

    @OneToOne(type => Product)
    @JoinColumn({name:"product_id"})
    product_id:Product;
    
    @Column()
    lote_interno:string;

    @Column()
    new_lote:string;

    @Column()
    weigth:string;
    
    @Column()
    temperature:string;

    @Column()
    entrance_hour:string;

    @Column()
    output_hour:string;

    @Column()
    end_date:string;

    @Column()
    start_date:string;

    @Column()
    status:string;

    @Column()
    current_process:string;
    
    @Column()
    name_elaborated:string;

    @Column()
    job_elaborated:string;

    @Column()
    name_verify:string;

    @Column()
    job_verify:string;

    @OneToOne(type => Grinding)
    @JoinColumn()
    molienda_id:Grinding;

    @OneToOne(type => Tenderized)
    @JoinColumn({name:"tenderized_id"})
    tenderized_id:Tenderized;

    @OneToOne(type => Conditioning)
    @JoinColumn({name:"conditioning_id"})
    conditioning_id:Conditioning;

    @OneToOne(type => Sausaged)
    @JoinColumn()
    sausage_id:Sausaged;

    @OneToOne(type => User)
    @JoinColumn()
    user_id:User;
}







