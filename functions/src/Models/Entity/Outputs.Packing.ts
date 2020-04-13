import { PrimaryGeneratedColumn, Column, Entity, JoinColumn, OneToOne  } from "typeorm";
import { User } from "./Users";


@Entity({name:"outputs_packing"})
export class OutputsPacking{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    lote_proveedor:string;

    @Column()
    date:string;

    @Column()
    quantity:string;

    @OneToOne(type => User )
    @JoinColumn()
    operator_outlet: User;
}