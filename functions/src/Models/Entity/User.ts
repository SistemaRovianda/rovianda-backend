import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { Roles } from './Roles';

@Entity({name:"user"})
export class Users{

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

}