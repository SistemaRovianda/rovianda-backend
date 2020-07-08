import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn, OneToMany } from "typeorm";
import { Roles } from './Roles';
import { EntranceMeat } from "./Entrances.Meat";
import { Maintenance } from "./Maintenance";
import { Formulation } from "./Formulation";

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

    @Column()
    job:string;

    @ManyToOne(type=>Roles,roles=>roles.users,{eager:true})
    @JoinColumn({name:"rol"})
    roles:Roles;

    @OneToMany(type =>EntranceMeat, entrancesMeat => entrancesMeat.qualityInspector)
    entrancesMeat:EntranceMeat[];

    @OneToMany(type=> Maintenance,maintenance=>maintenance.user)
    maintenance:Maintenance[];

    @OneToMany(type=> Formulation,formulationVerifit=>formulationVerifit.verifit)
    formulationVerifit:Formulation[];

    @OneToMany(type=> Formulation,formulationVerifit=>formulationVerifit.make)
    formulationMake:Formulation[];
}