import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn, OneToMany } from "typeorm";
import { Roles } from './Roles';
import { EntranceMeat } from "./Entrances.Meat";

@Entity({name:"users"})
export class User{

    @PrimaryColumn()
    id:string;

    @Column()
    name:string;

    @Column({name:"first_surname"})
    firstSurname:string;

    @Column({name:"last_surname"})
    lastSurname:string;

    @Column()
    email:string;

    @ManyToOne(type=>Roles,roles=>roles.users,{eager:true})
    @JoinColumn({name:"rol"})
    roles:Roles;

    @OneToMany(type =>EntranceMeat, entrancesMeat => entrancesMeat.qualityInspector)
    entrancesMeat:EntranceMeat[];
}