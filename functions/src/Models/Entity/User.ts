import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn, OneToMany } from "typeorm";
import { Roles } from './Roles';
import { EntranceMeat } from "./Entrances.Meat";
import { Maintenance } from "./Maintenance";
import { Formulation } from "./Formulation";
import { EntrancePacking } from "./Entrances.Packing";
import { SaleSeller } from "./Sale.Seller";
import { Packaging } from "./Packaging";

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

    @OneToMany(type=> Formulation,formulationMake=>formulationMake.make)
    formulationMake:Formulation[];

    @OneToMany(type=> EntrancePacking,entrancePackingVerifit=>entrancePackingVerifit.verifit)
    entrancePackingVerifit:EntrancePacking[];

    @OneToMany(type=> EntrancePacking,entrancePackinMake=>entrancePackinMake.make)
    entrancePackinMake:EntrancePacking[];

    @OneToMany(type=> SaleSeller,saleSeller=>saleSeller.user,{eager:false})
    saleSeller: SaleSeller[];

    @OneToMany(type=> Packaging,packaging=>packaging.userId)
    packaging:Packaging[];
}