import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Maintenance } from './Maintenance';
import { StoreDevice } from './Store.Devices';

@Entity({ name: "devices" })
export class Devices {

    @PrimaryGeneratedColumn({ name: "device_id" })
    id: number;

    @Column()
    name: string;

    @Column({ name: "cost_device" })
    costDevice: string;

    @Column()
    model: string;

    @Column()
    date: string;

    @Column()
    description: string;

    @OneToMany(type=> Maintenance,maintenance=>maintenance.devices,{eager:false})
    maintenance: Maintenance[];

    @OneToMany(type=> StoreDevice,storeDevice=>storeDevice.devices,{eager:false})
    storeDevice: StoreDevice[];
}