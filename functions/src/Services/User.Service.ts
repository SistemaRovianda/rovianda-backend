import { UserRepository } from "../Repositories/User.Repository";
import { RolesRepository } from "../Repositories/Roles.Repository";
import { User } from '../Models/Entity/User';
import { UserDTO } from '../Models/DTO/UserDTO';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { userGeneric } from '../Models/UserGeneric';
import { Request } from 'express';
import { Roles } from "../Models/Entity/Roles";

export class UserService{
    private userRepository:UserRepository;
    private rolesRepository:RolesRepository
    constructor(private firebaseHelper:FirebaseHelper){
        this.userRepository = new UserRepository();
        this.rolesRepository = new RolesRepository();
        
    }

    async createUserF(userDTO:UserDTO, userGeneric:userGeneric){
        let roles:Roles = await this.rolesRepository.getRole(userDTO.rol);
        console.log(roles)
        //if(!roles[0])  throw new Error("[404],roles not found");
        if(!roles) throw new Error("[404], roles not found");
        if(!userDTO.name) throw new Error("[400], name is required");
        if(!userDTO.firstName) throw new Error("[400],firstName is required");
        if(!userDTO.lastName) throw new Error("[400], lastName is required");
        if(!userDTO.email) throw new Error("[400], email is required");
        if(!userDTO.password) throw new Error("[400], password is required");
        if(!userDTO.rol) throw new Error("[400], rol is required");
        //console.log(roles[0]);
        let us:User = await this.userRepository.getUserByEmail(userDTO.email);
        if(us) throw new Error("[409], email exist");
        let users:User= new User();
        users.name = userDTO.name;
        users.firstSurname = userDTO.firstName;
        users.lastSurname = userDTO.lastName;
        users.email = userDTO.email;
        users.job = userDTO.job;
        users.roles = roles;

        return this.firebaseHelper.createUser(userGeneric).then(async(userRecord)=>{
            users.id = userRecord.uid;
            return await this.userRepository.saveUser(users);
        });
    }

    async createToken(uid){
        if(!uid) throw new Error("[400], uid is required");
        let user:User = await this.userRepository.getUserById(uid);
        if(!user) throw new Error("[404], user not found");
        return this.firebaseHelper.createToken(uid);
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
            rol: `${user.roles.description}`,
            job: `${user.job}`
        };
        return response;
    }

    async getByEmail(email:string){
        return await this.userRepository.getUserByEmail(email);
    }

    async getAllUsers(){
        let users:User[] = await this.userRepository.getAllUsers();
        let response:any = []
        users.forEach(i =>{
            response.push({
                userId: `${i.id}`,
                fullName: `${i.name} ${i.firstSurname} ${i.lastSurname}`,
                rol: `${i.roles.description}`,
                job: `${i.job}`
            })
        })
        return response;
    }

    async getUserByRol(rol:string){
        if(!rol) throw new Error("[400], rol is required");
        let roles:Roles = await this.rolesRepository.getRolByDescription(rol);
        if(!roles) throw new Error("[404], rol not found");
        let users:User[] = await this.userRepository.getByRol(roles);
        let response:any = [];
        users.forEach(i =>{
            response.push({
                userId: `${i.id}`,
                fullName: `${i.name} ${i.firstSurname} ${i.lastSurname}`,
                rol: `${i.roles.description}`,
                job: `${i.job}`
            })
        })
        return response;
    }

    async getUserByUid(uid:string){
        if(!uid) throw new Error("[400], uid is required");
        let user:User = await this.userRepository.getUserById(uid);
        if(!user) throw new Error("[404], User not found");
        return user;    }

    async getUserByFullName(name:string){
        let fullname= name.split(" ");
        let user:User = await this.userRepository.getUserByFullName(fullname[0],fullname[1],fullname[2]);
        if(!user) throw new Error("[404], User not found");
        return user;    }        
}