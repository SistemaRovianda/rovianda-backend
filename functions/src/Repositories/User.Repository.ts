import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { User } from '../Models/Entity/Users';
export class UserRepository{
    private userRepository:Repository<User>;

    async getConnection(){
        if(!this.userRepository){
            this.userRepository = (await connect()).getRepository(User);
        }
    }

    async saveUser(user:User){
        await this.getConnection();
        return await this.userRepository.save(user);
    }

    async getUserById(userId:string){
        await this.getConnection();
        return await this.userRepository.findOne({userId});
    }

    async getUserByName(name:string){
        await this.getConnection();
        return await this.userRepository.findOne({
            where: {name: `${name}`},
        });
    }
}