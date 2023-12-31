import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { PropertiesPackaging } from "./Properties.Packaging";

@Entity({ name: "box_packaging" })
export class BoxPackaging {
    @PrimaryGeneratedColumn({ name: "box_id" })
    id: number;

    // @ManyToOne(type => PropertiesPackaging)
    // @JoinColumn({ name: "properties_id" })
    // propertiesId: PropertiesPackaging;

    @Column({ name: "count_initial" })
    countInitial: string;

    @Column({ name: "count_end" })
    countEnd: string;

    
}