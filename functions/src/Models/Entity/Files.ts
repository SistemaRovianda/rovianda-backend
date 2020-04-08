import { PrimaryGeneratedColumn, Column, Entity, ManyToMany} from "typeorm";
import { Entrances_Meat } from "./Entrances.Meat"

@Entity({name:"files"})
export class File{

    @PrimaryGeneratedColumn()
    file_id:number;

    @Column()
    url:string;

    @ManyToMany(type => Entrances_Meat, entrances_meat => entrances_meat.photo) 
    entrancesMeat:Entrances_Meat[];
}