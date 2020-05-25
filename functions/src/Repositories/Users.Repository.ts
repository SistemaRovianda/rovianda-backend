import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Users } from '../Models/Entity/User';
export class UsersRepository{
    private usersRepository:Repository<Users>;

    async getConnection(){
        if(!this.usersRepository){
            this.usersRepository = (await connect()).getRepository(Users);
        }
    }

    async saveUser(user:Users){
        await this.getConnection();
        return await this.usersRepository.save(user);
    }

    async getUserByEmail(email:string){
        console.log("entraRep")
        await this.getConnection();
        return await this.usersRepository.query(`SELECT * FROM user WHERE email = "${email}"`);
    }

    async getUserById(uuid:string){
        await this.getConnection();
        return await this.usersRepository.findOne({
            where: {id:uuid}});
    }

    // async getUserById(userId:string){
    //     await this.getConnection();
    //     return await this.userRepository.findOne({userId});
    // }

    // async getUserByName(name:string){
    //     await this.getConnection();
    //     return await this.userRepository.findOne({
    //         where: {name: `${name}`},
    //     });
    // }
}