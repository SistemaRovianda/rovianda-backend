import { UserRepository } from "../Repositories/User.Repository";
import { RolesRepository } from "../Repositories/Roles.Repository";
import { User } from '../Models/Entity/User';
import { UserDTO } from '../Models/DTO/UserDTO';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { userGeneric } from '../Models/UserGeneric';
import { Request } from 'express';

export class UserService{
    private userRepository:UserRepository;
    private rolesRepository:RolesRepository
    constructor(private firebaseHelper:FirebaseHelper){
        this.userRepository = new UserRepository();
        this.rolesRepository = new RolesRepository();
        
    }

    async createUserF(userDTO:UserDTO, userGeneric:userGeneric){
        let roles = await this.rolesRepository.getRole(userDTO.rol);
        console.log(roles)
        if(!roles[0])  throw new Error("[404],roles not found");
        if(!userDTO.name) throw new Error("[400], name is required");
        if(!userDTO.firstName) throw new Error("[400], firstName is required");
        if(!userDTO.lastName) throw new Error("[400], lastName is required");
        if(!userDTO.email) throw new Error("[400], email is required");
        if(!userDTO.password) throw new Error("[400], password is required");
        if(!userDTO.rol) throw new Error("[400], rol is required");
        console.log(roles[0]);
        let users:User= new User();
        users.name = userDTO.name;
        users.firstSurname = userDTO.firstName;
        users.lastSurname = userDTO.lastName;
        users.email = userDTO.email;
        users.roles = roles[0];

        return this.firebaseHelper.createUser(userGeneric).then(async(userRecord)=>{
            users.id = userRecord.uid;
            return await this.userRepository.saveUser(users);
        });
    }

    async createUser(user:User){
        return await this.userRepository.saveUser(user);
    }

    async getUserByName(name:string){
        return await this.userRepository.getUserByName(name);
    }

    async getUserById(req:Request){
        if(!req.params.uuid) throw new Error("[400], uuid is required");
        let user:User = await this.userRepository.getUserById(req.params.uuid);
        if(!user)  throw new Error("[404],user not found");
        let response = {};
        response ={
            uuid: `${user.id}`,
            name: `${user.name}`,
            firstSurname: `${user.firstSurname}`,
            lastSurname: `${user.lastSurname}`,
            email: `${user.email}`,
            rol: `${user.roles.description}`
        };
        return response;
    }

    async getByEmail(email:string){
        return await this.userRepository.getUserByEmail(email);
    }

}