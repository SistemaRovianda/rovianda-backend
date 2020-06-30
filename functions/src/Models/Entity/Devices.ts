import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Maintenance } from './Maintenance';

@Entity({ name: "devices" })
export class Devices {

    @PrimaryGeneratedColumn({ name: "device_id" })
    id: number;

    @Column()
    name: string;

    @Column({ name: "cost_device" })
    costdevice: string;

    @Column()
    model: string;

    @OneToMany(type=> Maintenance,maintenance=>maintenance.devices,{eager:false})
    maintenance: Maintenance[];
}