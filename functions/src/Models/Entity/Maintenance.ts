import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Store } from './Store';
import { Devices } from './Devices';
import { User } from './User';
import { user } from 'firebase-functions/lib/providers/auth';

@Entity({ name: "maintenance" })
export class Maintenance {

    @PrimaryGeneratedColumn({ name: "maintenance_id" })
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne(type=>User, user=>user.maintenance, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"user_id"})
    user:User;
    
    @Column()
    picture: string;

    @Column({name:"date_init"})
    dateInit: string;

    @Column({name:"date_end"})
    dateEnd: string;

    @Column()
    status: string;

    // @Column({ name: "picture_end"})
    // pictureEnd:string;

    @Column({ name: "description_end"})
    descriptionEnd:string;

    @Column()
    cost: string;

    @ManyToOne(type=>Store, store=>store.maintenance, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"store_id"})
    store:Store;

    @ManyToOne(type=>Devices, devices=>devices.maintenance, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"device_id"})
    devices:Devices;
}