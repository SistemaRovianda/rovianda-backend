import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";
import { Entrances_Meat } from './Entrances.Meat';

@Entity({name:"users"})
export class User{

    @PrimaryGeneratedColumn()
    user_id:string;

    @Column({name:"name"})
    name:string;

    @Column()
    first_surname:string;

    @Column()
    last_surname:string;

    @Column()
    email:string;

    @Column()
    rol:string;

    @ManyToOne(type =>Entrances_Meat, entrances_meat => entrances_meat.id)
    entrancesMeat:Entrances_Meat;
}