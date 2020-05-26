import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import { Grinding } from './Grinding';

import { Tenderized } from './Tenderized';
import { Conditioning } from './Conditioning';
import { Sausaged } from './Sausaged';
import { Product } from './Product';
import { ProductRovianda } from "./Product.Rovianda";
import { User } from "./User";

@Entity({name:"process"})
export class Process{

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(type => ProductRovianda,productR=>productR.process)
    productId:ProductRovianda;
    
    @Column({name:"lote_interno"})
    loteInterno:string;

    @Column({name:"new_lote"})
    newLote:number;

    @Column()
    weigth:number;
    
    @Column()
    temperature:string;

    @Column({name:"entrance_hour"})
    entranceHour:string;

    @Column({name:"output_hour"})
    outputHour:string;

    @Column({name:"end_date"})
    endDate:string;

    @Column({name:"start_date"})
    startDate:string;

    @Column()
    status:string;

    @Column({name:"current_process"})
    currentProcess:string;
    
    @Column({name:"name_elaborated"})
    nameElaborated:string;

    @Column({name:"job_elaborated"})
    jobElaborated:string;

    @Column({name:"name_verify"})
    nameVerify:string;

    @Column({name:"job_verify"})
    jobVerify:string;

    @OneToOne(type => Grinding)
    @JoinColumn({name:"grinding_id"})
    grindingId:Grinding;

    @OneToOne(type => Tenderized)
    @JoinColumn({name:"tenderized_id"})
    tenderizedId:Tenderized;

    @OneToOne(type => Conditioning)
    @JoinColumn({name:"conditioning_id"})
    conditioningId:Conditioning;

    @OneToOne(type => Sausaged)
    @JoinColumn({name:"sausage_id"})
    sausageId:Sausaged;

    @OneToOne(type => User)
    @JoinColumn({name:"user_id"})
    userId:User;
}







