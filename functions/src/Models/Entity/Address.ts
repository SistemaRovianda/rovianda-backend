import { Entity, PrimaryGeneratedColumn, Code, Column } from "typeorm";

@Entity({name:"address"})
export class Address{
    
    @PrimaryGeneratedColumn({name:"address_id"})
    id:number;

    @Column()
    state:string;

    @Column()
    municipality:string;

    @Column()
    location:string;

    @Column()
    suburb:string;

    @Column({name:"ext_number"})
    extNumber:number;

    @Column()
    street:string;

    @Column()
    reference:string;
}