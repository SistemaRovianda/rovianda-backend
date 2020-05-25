import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from "typeorm";
import { User } from './User';

@Entity({name:"roles"})
export class Roles{

    @PrimaryGeneratedColumn({name:"role_id"})
    roleId:number;

    @Column()
    description:string;

    @OneToMany(type=> User,user=>user.roles)
    users:User[];

}