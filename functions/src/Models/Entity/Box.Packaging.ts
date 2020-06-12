import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToOne } from 'typeorm';
import { PropertiesPackaging } from "./Properties.Packaging";

@Entity({ name: "box_packaging" })
export class BoxPackaging {
    @PrimaryGeneratedColumn({ name: "box_id" })
    id: number;

    @OneToOne(type => PropertiesPackaging, propertiesPackaging => propertiesPackaging.boxPackaging)
    @JoinColumn({ name: "property_id" })
    propertiesId: PropertiesPackaging;

    @Column({ name: "count_initial" }) 
    countInitial: string;

    @Column({ name: "count_end" })
    countEnd: string;
}