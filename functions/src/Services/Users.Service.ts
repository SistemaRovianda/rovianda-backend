import { UsersRepository } from '../Repositories/Users.Repository';
import { Users } from '../Models/Entity/User';
import {Request} from 'express';
import { userGeneric } from '../Models/UserGeneric';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { UserDTO } from '../Models/DTO/UserDTO';
import { RolesRepository } from '../Repositories/Roles.Repository';

export class UsersService{
    private usersRepository:UsersRepository;
    private rolesReporitory:RolesRepository
    constructor(private firebaseInstance:FirebaseHelper){
        this.usersRepository = new UsersRepository();
        this.rolesReporitory = new RolesRepository();
    }

    async createUser(userDTO:UserDTO, userGeneric:userGeneric){

        let roles = await this.rolesReporitory.getRole(userDTO.rol);

        if(!roles[0])  throw new Error("[404],roles not found");
        if(!userDTO.name) throw new Error("[400], name is required");
        if(!userDTO.firstName) throw new Error("[400], firstName is required");
        if(!userDTO.lastName) throw new Error("[400], lastName is required");
        if(!userDTO.email) throw new Error("[400], email is required");
        if(!userDTO.password) throw new Error("[400], password is required");
        if(!userDTO.rol) throw new Error("[400], rol is required");
        console.log(roles[0]);
        let users:Users = new Users();
        users.name = userDTO.name;
        users.firstSurname = userDTO.firstName;
        users.lastSurname = userDTO.lastName;
        users.email = userDTO.email;
        users.roles = roles[0];

        return this.firebaseInstance.createUser(userGeneric).then(async(userRecord)=>{
            users.id = userRecord.uid;
            return await this.usersRepository.saveUser(users);
        });
    }

    async getUserByEmail(email:string){
        console.log("entraser")
        return await this.usersRepository.getUserByEmail(email);
    }

    async getUserById(req:Request){
        if(!req.params.uuid) throw new Error("[400], uuid is required");
        let user:Users = await this.usersRepository.getUserById(req.params.uuid);
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

    // async getUserByName(name:string){
    //     return await this.userRepository.getUserByName(name);
    // }
    
}