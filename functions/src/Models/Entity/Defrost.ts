import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OutputsCooling } from "./outputs.cooling";

@Entity({name:"defrost"})
export class Defrost{

    @PrimaryGeneratedColumn({name:"defrost_id"})
    defrostId:number;

    @OneToOne(type=>OutputsCooling,{eager:true})
    @JoinColumn()
    outputCooling:OutputsCooling;

    @Column()
    weigth:string;

    @Column()
    temp:string;

    @Column({name:"entrance_hour"})
    entranceHour:string;

    @Column({name:"output_hour"})
    outputHour:string;

    @Column({name:"date_init"})
    dateInit:string;

    @Column({name:"date_end"})
    dateEnd:string;

    @Column()
    status:string;

}