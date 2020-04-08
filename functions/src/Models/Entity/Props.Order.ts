import { PrimaryGeneratedColumn, Column, Entity, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { ExtrasOrders } from './Extra.Orders';
import { Entrances_Meat } from './Entrances.Meat';


@Entity({name:"props_order"})
export class PropsOrder{

    @PrimaryGeneratedColumn()
    prop_id:number;

    @Column()
    value:string;

    @Column()
    observations:string;
    
    @Column()
    status:string;

    @OneToMany(type => ExtrasOrders, extra_order => extra_order.extra_id)
    extra_id:ExtrasOrders[];
    
    @OneToOne(type => Entrances_Meat)
    @JoinColumn({name:"props_ordert_entrancemeatid_fk"})
    entrances_meat_id:Entrances_Meat;
}