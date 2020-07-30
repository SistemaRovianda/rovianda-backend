import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Maintenance } from './Maintenance';
import { StoreDevice } from './Store.Devices';

@Entity({ name: "store" })
export class Store {

    @PrimaryGeneratedColumn({ name: "store_id" })
    id: number;

    @Column()
    name: string;

    @Column()
    location: string;

    @Column()
    reference: string;

    @OneToMany(type=> Maintenance,maintenance=>maintenance.store,{eager:false})
    maintenance: Maintenance[];

    @OneToMany(type=> StoreDevice,storeDevice=>storeDevice.store,{eager:false})
    storeDevice: StoreDevice[];
}