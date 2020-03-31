import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";



@Entity({name:"pin"})
export class Pin{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    
    
}