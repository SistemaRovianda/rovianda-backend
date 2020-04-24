import { UserRepository } from '../Repositories/User.Repository';
import { User } from '../Models/Entity/Users';

export class UserService{
    private userRepository:UserRepository;
    constructor(){
        this.userRepository = new UserRepository();
    }

    async createUser(user:User){
        return await this.userRepository.saveUser(user);
    }

    async getUserByName(name:string){
        return await this.userRepository.getUserByName(name);
    }
    
}