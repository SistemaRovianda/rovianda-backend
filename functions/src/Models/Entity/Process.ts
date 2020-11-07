import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, OneToOne, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import { Grinding } from './Grinding';
import { Tenderized } from './Tenderized';
import { Conditioning } from './Conditioning';
import { Sausaged } from './Sausaged';
import { ProductRovianda } from "./Product.Rovianda";
import { User } from "./User";
import { Formulation } from "./Formulation";
import { Reprocessing } from "./Reprocessing";


@Entity({name:"process"})
export class Process{

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(type => ProductRovianda,productR=>productR.process,{eager:true})
    @JoinColumn({name:"product_rovianda_id"})
    product:ProductRovianda;
    
    @Column({name:"entrance_hour"})
    entranceHour:string;

    @Column({name:"output_hour"})
    outputHour:string;

    @Column({name:"end_date"})
    endDate:string;

    @Column({name:"start_date"})
    startDate:string;

    @Column()
    status:string;

    @Column({name:"current_process"})
    currentProcess:string;
    
    @Column({name:"name_elaborated"})
    nameElaborated:string;

    @Column({name:"job_elaborated"})
    jobElaborated:string;

    @Column({name:"name_verify"})
    nameVerify:string;

    @Column({name:"job_verify"})
    jobVerify:string;

    
    @OneToMany(type=>Grinding,grinding=>grinding.process,{cascade:true,nullable:true})
    grinding:Grinding[];

    @OneToMany(type=>Tenderized,tenderized=>tenderized.process,{cascade:true,nullable:true})
    tenderized:Tenderized[];

    @OneToMany(type=>Conditioning,conditioning=>conditioning.process,{cascade:true,nullable:true})
    conditioning:Conditioning[];

    @OneToMany(type=>Sausaged,sausaged=>sausaged.process,{cascade:true,nullable:true})
    sausage:Sausaged[];

    @OneToOne(type => User)
    @JoinColumn({name: "user_id"})
    userId:User;

    @Column({name:"create_at"})
    createAt:string

    @OneToOne(type=>Formulation,formulation=>formulation.process,{eager:true})
    @JoinColumn()
    formulation:Formulation;
    // @OneToOne(type => Grinding)
    // @JoinColumn({ name: "molienda_id" })
    // moliendaId: Grinding;
    
    @OneToMany(type=>Reprocessing,reprocesing=>reprocesing.process,{cascade:true})
    reprocesings:Reprocessing[];

}







