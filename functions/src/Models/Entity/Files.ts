import { PrimaryGeneratedColumn, Column, Entity} from "typeorm";
@Entity({name:"files"})
export class File{

    @PrimaryGeneratedColumn({name:"file_id"})
    fileId:number;

    @Column()
    url:string;

}