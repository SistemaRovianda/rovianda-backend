import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Store } from './Store';
import { Devices } from './Devices';
import { User } from './User';

@Entity({ name: "store_devices" })
export class StoreDevice {

    @PrimaryGeneratedColumn({ name: "store_devices_id" })
    id: number;

    @ManyToOne(type=>Store, store=>store.storeDevice, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"store_id"})
    store:Store;

    @ManyToOne(type=>Devices, devices=>devices.storeDevice, {eager:true, onDelete:"SET NULL"})
    @JoinColumn({name:"device_id"})
    devices:Devices;
}