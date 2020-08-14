import { FormulationRepository } from "../Repositories/Formulation.Repository";
import { FormulationDTO } from "../Models/DTO/FormulationDTO";
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

export class FormulationService {
    private formulationRepository: FormulationRepository;
    private productRoviandaRepository: ProductRoviandaRepository;
    private productRepository: ProductRepository;
    private outputsDriedRepository: OutputsDriefRepository;
    private formulationIngredientsRepository: FormulatioIngredientsRepository;
    private outputsCooling:OutputsCoolingService;
    private userRepository:UserRepository;
    private outputsCoolingRepository:OutputsCoolingRepository;
    constructor() {
        this.formulationRepository = new FormulationRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.productRepository = new ProductRepository();
        this.outputsDriedRepository = new OutputsDriefRepository();
        this.formulationIngredientsRepository = new FormulatioIngredientsRepository();
        this.outputsCooling = new OutputsCoolingService();
        this.userRepository = new UserRepository();
        this.outputsCoolingRepository = new OutputsCoolingRepository();
    }

    async createFormulation(req: Request) {
        let formulationDTO: FormulationDTO = req.body;
        if (!formulationDTO.productRoviandaId)
            throw new Error("[400],productRobiandaId is required");

        let productRovianda: ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(+formulationDTO.productRoviandaId);
        if (!productRovianda)
            throw new Error(`[409], Rovianda Product with id ${formulationDTO.productRoviandaId} was not found`)
        if (!formulationDTO.lotId)
            throw new Error("[400], lotId is required");
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
        // if (!formulationDTO.assignmentLot.newLotId)
        //     throw new Error("[400], assigmentLot is missing newLotId attribute");
        // if (!formulationDTO.assignmentLot.dateEntry)
        //     throw new Error("[400], assigmentLot is missing dateEntry attribute");
        for(let ingredient of formulationDTO.ingredient){
            if (!ingredient.ingredientId)
                throw new Error("[400], One of ingredients is missing ingredentId attribute");
            
            if (!ingredient.lotId)
                throw new Error("[400], One of ingredients is missing lotId attribute");
        }
        let outputCooling:OutputsCooling = await this.outputsCooling.getOutputsCoolingByLot(formulationDTO.lotId);       
        if(!outputCooling) throw new Error("[404], no existe salida de este lote");
        let verifit:User = await this.userRepository.getUserById(formulationDTO.verifitId);       
        if(!verifit) throw new Error("[404], no existe verifit");
        let make:User = await this.userRepository.getUserById(formulationDTO.makeId);       
        if(!make) throw new Error("[404], no existe make");
        let formulationToSave: Formulation =new Formulation();
        
        formulationToSave.loteInterno= formulationDTO.lotId;
        formulationToSave.productRovianda= productRovianda;
        formulationToSave.temp= formulationDTO.temperature;
        formulationToSave.verifit = verifit;
        formulationToSave.make = make;
        formulationToSave.date = formulationDTO.date;
        formulationToSave.waterTemp=formulationDTO.temperatureWater;
        //formulationToSave.newLote=`${formulationDTO.assignmentLot.newLotId} ${formulationDTO.assignmentLot.dateEntry}`
        
        try {
            let formulationSaved = await this.formulationRepository.saveFormulation(formulationToSave);
            
            let fors:Formulation[] = await this.formulationRepository.getLastFormulation();
            console.log(fors[0])
            for (let i = 0; i < formulationDTO.ingredient.length; i++) {

                let product: Product = await this.productRepository.getProductById(+formulationDTO.ingredient[i].ingredientId);
                console.log(product)
                if (product) {
                    let outputDried: OutputsDrief = await this.outputsDriedRepository.getOutputsDriefByLot(formulationDTO.ingredient[i].lotId);
                    console.log(outputDried)
                    if (outputDried) {
                        let formulationIngredients: FormulationIngredients = {
                            id: 0,
                            formulationId: fors[0],
                            lotId: outputDried,
                            productId: product
                        }
                        console.log("pasa")
                        await this.formulationIngredientsRepository.saveFormulationIngredients(formulationIngredients);
                    }
                }
            }
            let id:any = await this.formulationRepository.getLastFormulation();
            return id[0].id;
        } catch (err) {
            throw new Error(`[500], ${err}`);
        }
    }

    async getbyLoteIdAndProductId(loteId:string,productId:ProductRovianda){
        return await this.formulationRepository.getByLoteId(loteId,productId);
    }

    async getFormulation(){
        let formulation:any = await this.formulationRepository.getAllFormulationOrderProduct();
        let response = [];
        for(let i = 0; i<formulation.length; i++){
            let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(+formulation[i].product_rovianda_id);
            let lots:Formulation[] = await this.formulationRepository.getFormulationByProductRovianda(product);
            let response2:any = []
            lots.forEach(e =>{
                response2.push(e.loteInterno)
            })
            response.push({
                productRoviandaId: `${product.id}`,
                productRovianda: `${product.name}`,
                lots: response2
            })
        }
        return response;
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
        let parsedInitDate = new Date(initDate);
        let parsedFinDate = new Date(finDate);
        let formulations: Formulation[] = await this.formulationRepository.getFormulationsByDate(parsedInitDate, parsedFinDate);
        
        if(!formulations.length)
            throw new Error("[404], No formulations found, can not generate report");
            
        return formulations;
    }

    async getAllFormulationLoteMeat(){
        let formulation:Formulation[] = await this.formulationRepository.getAllFormulationLoteMeat();
        let response:any = [];
        formulation.forEach( i=> {
            response.push({
                loteMeat: i.loteInterno,
                productId: i.productRovianda.id
            })
        });
        return response;
    }

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

}