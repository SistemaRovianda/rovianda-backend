import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { User } from '../Models/Entity/User';
import { Roles } from '../Models/Entity/Roles';
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
        return await this.userRepository.findOne({id:userId});
    }

    async getUserByName(name:string){
        await this.getConnection();
        return await this.userRepository.findOne({
            where: {name: `${name}`},
        });
    }

    async getUserByEmail(email:string){
        await this.getConnection();
        return await this.userRepository.findOne({
            email
        });
    }

    async getAllUsers(){
        await this.getConnection();
        return await this.userRepository.find();
    }

    async getByFullName(name:string,firstSurname:string,lastSurname:string){
        await this.getConnection();
        return await this.userRepository.query(`
        SELECT * FROM users WHERE name = "${name}" 
        AND first_surname = "${firstSurname}" 
        AND last_surname = "${lastSurname}"`);
    }

    async getByRol(roles:Roles){
        await this.getConnection();
        return await this.userRepository.find({roles});
    }
}