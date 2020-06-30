import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Maintenance } from './Maintenance';

@Entity({ name: "store" })
export class Store {

    @PrimaryGeneratedColumn({ name: "store_id" })
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @OneToMany(type=> Maintenance,maintenance=>maintenance.store,{eager:false})
    maintenance: Maintenance[];
}