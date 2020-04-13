
import { PrimaryGeneratedColumn, Column, Entity, ManyToMany} from "typeorm";

@Entity({name:"grinding"})
export class Grinding{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    raw:string;

    @Column()
    process:string;

    @Column()
    weight:string;
    
    @Column()
    date:string;
}



