import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Store } from './Store';
import { Devices } from './Devices';
import { User } from './User';
import { File } from './Files';

@Entity({ name: "maintenance" })
export class Maintenance {

    @PrimaryGeneratedColumn({ name: "maintenance_id" })
    id:number;

    @Column()
    title:string;

    @Column()
    description:string;
    
    @Column()
    picture:string;

    @Column()
    date:string;

    @Column()
    status:string;

    @Column({ name: "description_end",nullable:true})
    descriptionEnd:string;

    @Column({nullable:true})
    cost: string;

    @ManyToOne(type=>Store, store=>store.maintenance, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"store_id"})
    store:Store;

    @ManyToOne(type=>Devices, devices=>devices.maintenance, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"device_id"})
    devices:Devices;

    @ManyToOne(type=>User, user=>user.maintenance, {eager:true, onDelete:"SET NULL"})
    @JoinColumn()
    user:User;
}