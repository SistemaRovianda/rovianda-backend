import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { EntranceMeat } from './Entrances.Meat';

@Entity({name:"users"})
export class User{

    @PrimaryGeneratedColumn({name:"user_id"})
    userId:string;

    @Column({name:"name"})
    name:string;

    @Column({name:"first_surname"})
    firstSurname:string;

    @Column({name:"last_surname"})
    lastSurname:string;

    @Column()
    email:string;

    @Column()
    rol:string;

}