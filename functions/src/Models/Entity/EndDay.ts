import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"end_days_records"})
export class EndDay{

    @PrimaryGeneratedColumn({name:"end_day_record_id"})
    id:number;

    @Column({nullable:false})
    date:string;

    @Column({name:"seller_id",nullable:false})
    sellerId:string;

    @Column({name:"date_sincronized",nullable:false})
    dateSincronized:string;
}