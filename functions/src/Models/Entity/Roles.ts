import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from "typeorm";
import { Users } from './User';

@Entity({name:"roles"})
export class Roles{

    @PrimaryGeneratedColumn({name:"role_id"})
    roleId:number;

    @Column()
    description:string;

    @OneToMany(type=> Users,users=>users.roles)
    users:Users[];

}