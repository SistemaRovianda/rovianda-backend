import { Entity, PrimaryGeneratedColumn, Code, Column } from "typeorm";

@Entity({name:"address"})
export class Address{
    
    @PrimaryGeneratedColumn({name:"address_id"})
    id:number;

    @Column()
    street:string;

    @Column({name:"ext_number"})
    extNumber:number;

    @Column({name:"int_number",nullable:false})
    intNumber:number;

    @Column({name:"intersection_one",nullable:true})
    intersectionOne:string;

    @Column({name:"intersection_two",nullable:true})
    intersectionTwo:string;

    @Column()
    suburb:string;

    @Column()
    location:string;

    @Column()
    reference:string;

    @Column()
    population:string;

    @Column({nullable:false})
    cp:number;

    @Column()
    state:string;

    @Column()
    municipality:string;


    @Column({nullable:false})
    nationality:string;

    

}