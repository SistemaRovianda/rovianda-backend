import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity({name:"sales_request"})
export class SalesRequest{

    @PrimaryGeneratedColumn({name:"request_id"})
    requestId:number;

    @Column({name:"user_id"})
    userId:string;

    @Column()
    vendedor:string;

    @Column()
    status:boolean;   
}