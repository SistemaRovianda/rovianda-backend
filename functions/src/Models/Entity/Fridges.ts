import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany  } from "typeorm";
import { Cooling } from './Cooling';


@Entity({name:"fridges"})
export class Fridge{

    @PrimaryGeneratedColumn({name:"fridge_id"})
    fridgeId:number;

    @Column()
    temp:string;
    
    @OneToMany(type=> Cooling,cooling=>cooling.fridge,{eager:false})
    coolings: Cooling[];

    @Column()
    status:string;

}