import { FormulationRepository } from "../Repositories/Formulation.Repository";
import { FomulationByProductRovianda, FormulationDTO, outputCoolingByStatusAndRawId } from "../Models/DTO/FormulationDTO";
import { Request } from "express";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { ProductRoviandaRepository } from "../Repositories/Product.Rovianda.Repository";
import { Formulation } from "../Models/Entity/Formulation";
import { Product } from "../Models/Entity/Product";
import { ProductRepository } from "../Repositories/Product.Repository";
import { OutputsDriefRepository } from "../Repositories/Outputs.Drief.Repository";
import { OutputsDrief } from "../Models/Entity/Outputs.Drief";
import { FormulationIngredients } from "../Models/Entity/Formulation.Ingredients";
import { FormulatioIngredientsRepository } from "../Repositories/Formulation.Ingredients.Repository";
import { OutputsCoolingService } from "./Outputs.Cooling.Service";
import { OutputsCooling } from "../Models/Entity/outputs.cooling";
import { User } from "../Models/Entity/User";
import { UserRepository } from "../Repositories/User.Repository";
import { OutputsCoolingStatus } from "../Models/Enum/OutputsCoolingStatus";
import { OutputsCoolingRepository } from '../Repositories/Outputs.Cooling.Repository';

import { Raw } from "../Models/Entity/Raw";
import { RawRepository } from "../Repositories/Raw.Repository";
import { Defrost } from "../Models/Entity/Defrost";
import { DefrostRepository } from "../Repositories/Defrost.Repository";
import { DefrostFormulation } from "../Models/Entity/Defrost.Formulation";

export class FormulationService {
    private formulationRepository: FormulationRepository;
    private productRoviandaRepository: ProductRoviandaRepository;
    private productRepository: ProductRepository;
    private outputsDriedRepository: OutputsDriefRepository;
    private formulationIngredientsRepository: FormulatioIngredientsRepository;
    private outputsCooling:OutputsCoolingService;
    private userRepository:UserRepository;
    private outputsCoolingRepository:OutputsCoolingRepository;
    private rawMaterialRepository:RawRepository;
    private defrostRepository:DefrostRepository;
    constructor() {
        this.formulationRepository = new FormulationRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.productRepository = new ProductRepository();
        this.outputsDriedRepository = new OutputsDriefRepository();
        this.formulationIngredientsRepository = new FormulatioIngredientsRepository();
        this.outputsCooling = new OutputsCoolingService();
        this.userRepository = new UserRepository();
        this.outputsCoolingRepository = new OutputsCoolingRepository();
        this.rawMaterialRepository=new RawRepository();
        this.defrostRepository = new DefrostRepository();
    }

    async createFormulation(req: Request) {
        let formulationDTO: FormulationDTO = req.body;
        if (!formulationDTO.productRoviandaId)
            throw new Error("[400],productRobiandaId is required");

        let productRovianda: ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(+formulationDTO.productRoviandaId);
        if (!productRovianda)
            throw new Error(`[409], Rovianda Product with id ${formulationDTO.productRoviandaId} was not found`)
        if (!formulationDTO.ingredient)
            throw new Error("[400], ingredients is required");
        if (!formulationDTO.temperature)
            throw new Error("[400], lotId is required");
        if (!formulationDTO.date)
            throw new Error("[400], date is required");
        if (!formulationDTO.verifitId)
            throw new Error("[400], verifitId is required");
        if (!formulationDTO.makeId)
            throw new Error("[400], makeId is required");
        if (!formulationDTO.temperatureWater)
            throw new Error("[400], temperatureWater is required");
        let defrostFormulations:DefrostFormulation[] = new Array<DefrostFormulation>();
        for(let defrostObj of formulationDTO.lotsDefrost){
            let defrost:Defrost = await this.defrostRepository.getDefrostById(defrostObj.defrostId);
            if(!defrost) throw new Error("[409], no existe el lote en descongelamiento");
            if(defrost.status=="TAKED") throw new Error("[409], el lote de descongelamiento ya fue tomado");
            defrost.status ="TAKED";
            await this.defrostRepository.saveDefrost(defrost);
            let defrostFormulation:DefrostFormulation=new DefrostFormulation();
            defrostFormulation.defrost=defrost;
            defrostFormulation.lotMeat = defrost.outputCooling.loteInterno;
            defrostFormulations.push(defrostFormulation);
        }

        let formulationIngredients:Array<FormulationIngredients> = new Array();
        for(let ingredient of formulationDTO.ingredient){
            let outputDrief:OutputsDrief = await this.outputsDriedRepository.getOutputsDriefById(ingredient.lotRecordId);
            if(!outputDrief) throw new Error("[404], no existe la salida de ingredientes");
            if(outputDrief.status=="USED") throw new Error("[404],  la salida de ingredientes ya ha sido utilizada con el id: "+ingredient);
            outputDrief.status ="USED";
            
            await this.outputsDriedRepository.createOutputsDrief(outputDrief);
            let formulationIngredient:FormulationIngredients=new FormulationIngredients();
            formulationIngredient.lotId = outputDrief;
            formulationIngredient.product=outputDrief.product;
            formulationIngredients.push(formulationIngredient);
        }
        
        let verifit:User = await this.userRepository.getUserById(formulationDTO.verifitId);       
        if(!verifit) throw new Error("[404], no existe verifit");
        let make:User = await this.userRepository.getUserById(formulationDTO.makeId);       
        if(!make) throw new Error("[404], no existe make");

        let date:Date = new Date();
        date.setHours(date.getHours()-6)
        let day:string = date.getDate().toString();
        if(+day<10){
            day='0'+day;
        }
        let month=(date.getMonth()+1).toString();
        if(+month<10){
            month='0'+month;
        }
        let formulationToSave: Formulation =new Formulation();
        
        formulationToSave.defrosts=defrostFormulations;
        formulationToSave.productRovianda= productRovianda;
        formulationToSave.temp= formulationDTO.temperature;
        formulationToSave.verifit = verifit;
        formulationToSave.make = make;
        formulationToSave.date = formulationDTO.date;
        formulationToSave.waterTemp=formulationDTO.temperatureWater;
        formulationToSave.status="UNUSED";
        formulationToSave.ingredients = formulationIngredients;
        formulationToSave.lotDay = day+month+date.getFullYear();
        formulationToSave.date = date.toISOString()
        
        let formulationSaved:Formulation=await this.formulationRepository.saveFormulation(formulationToSave);
        return formulationSaved.id;
    }

    // async getbyLoteIdAndProductId(loteId:string,productId:ProductRovianda){
    //     return await this.formulationRepository.getByLoteId(loteId,productId);
    // }

    async getFormulationByProductRovianda(productRoviandaId:number){
        let productRovianda:ProductRovianda= await this.productRoviandaRepository.getById(productRoviandaId);
        let formulations:Formulation[] = await this.formulationRepository.getFormulationByProductRovianda(productRovianda);
        let response:Array<FomulationByProductRovianda>=new Array();
        for(let formulation of formulations){
            response.push({
                formulationId: formulation.id,
                productName: formulation.productRovianda.name,
                lotDay: formulation.lotDay,
                createAt: formulation.date
            });
        }
        
        return response;
    }

    async getByRawMaterial(rawMaterialId:number){ // servicio para obtener los registros de formulacion en los que se encuentra el tipo de carne buscado
        let rawMaterial:Raw = await this.rawMaterialRepository.getById(rawMaterialId);
        if(!rawMaterial) throw new Error("[404],no existe registro en formulacion de la materia prima");
        let outputsCooling:Array<OutputsCooling> = await this.outputsCooling.getOutputsCoolingByRawIdAndStatus("USED",rawMaterial);
        let formulations:Array<Formulation>= new Array();
        for(let outputCooling of outputsCooling){
            if(outputCooling.formulation){
                formulations.push(outputCooling.formulation);
            }
        }
        return formulations;
    }

    async reportFormulation(formulationId:number){
        if (!formulationId) throw new Error("[400], formulationId is required");
        let formulation:Formulation = await this.formulationRepository.getByFormulationId(formulationId);
        if (!formulation) throw new Error("[404], formulation not found");
        return formulation;
    }

    async reportFormulationIngredents(formulationId:number){
        if (!formulationId) throw new Error("[400], formulationId is required");
        let formulation:Formulation = await this.formulationRepository.getByFormulationId(formulationId);
        if (!formulation) throw new Error("[404], formulation not found");
        let formulationIngredients:FormulationIngredients[] = await this.formulationIngredientsRepository.getByFormulation(formulation);
        return formulationIngredients;
    }

    async getFormulartionByDates(initDate: string, finDate: string){
        if (!Date.parse(initDate)) throw new Error("[400], initDate has not a valid value");
        if (!Date.parse(finDate)) throw new Error("[400], finDate has not a valid value")
        let initDateParse = new Date(initDate);
        initDateParse.setHours(initDateParse.getHours()-6);
        let endDateParse = new Date(finDate);
        endDateParse.setHours(endDateParse.getHours()-6)
        
        let formulations: Formulation[] = await this.formulationRepository.getFormulationsByDate(initDateParse, endDateParse);
        
        if(!formulations.length)
            throw new Error("[404], No formulations found, can not generate report");
            
        return formulations;
    }

    // async getAllFormulationLoteMeat(){
    //     let formulation:Formulation[] = await this.formulationRepository.getAllFormulationLoteMeat();
    //     let response:any = [];
    //     formulation.forEach( i=> {
    //         response.push({
                
    //             productId: i.productRovianda.id
    //         })
    //     });
    //     return response;
    // }

    async getAllLotMeatByProductId(productId:number,status:string){
        if (!productId) throw new Error("[400],ProductId is required"); 
        if(!status) throw new Error("[400], status is required");
        let productRovianda:ProductRovianda = await this.productRoviandaRepository.getById(productId);
        if (!productRovianda) throw new Error("[404],Product Rovianda not found");
        let formulation = await this.formulationRepository.getByproductRovianda(productId);
        let response:any = [];
        let response2= [];
        if(status == OutputsCoolingStatus.NOTUSED || status == OutputsCoolingStatus.USED){
            for(let i = 0; i < formulation.length; i++){
                let outputsCooling = await this.outputsCoolingRepository.getByStatusAndLoteInterno(formulation[i].lote_interno,status);
                console.log(outputsCooling)
                for(let e = 0; e < outputsCooling.length; e++){
                    response.push({
                        lotId:`${outputsCooling[e].lote_interno}`,
                        quantity: `${outputsCooling[e].quantity}`,
                        outputId: `${outputsCooling[e].id}`
                    })
                }
            }
            return response;
        }else{
            throw new Error("[409], status incorrect");
        }
        

    }

    // async getFormulationOutputCoolingId(outputCoolingId:number){
    //     return await this.formulationRepository.getFormulationByOutputCoolingId(outputCoolingId);   
    // }

    async updateFormulation(formulation:Formulation){
        return await this.formulationRepository.saveFormulation(formulation);
    }

    async getDetails(formulationId:number){
        return await this.formulationRepository.getByFormulationId(formulationId);
    }

}