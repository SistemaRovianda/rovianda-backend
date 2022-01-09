import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"codes_access"})
export class CodeAccess{

    @PrimaryGeneratedColumn({name:"code_access_id"})
    codeAccessId:number;

    @Column({name:"user_id"})
    userId:string;

    @Column({name:"code"})
    code:string;

}