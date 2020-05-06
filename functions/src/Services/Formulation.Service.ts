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

export class FormulationService {
    private formulationRepository: FormulationRepository;
    private productRoviandaRepository: ProductRoviandaRepository;
    private productRepository: ProductRepository;
    private outputsDriedRepository: OutputsDriefRepository;
    private formulationIngredientsRepository: FormulatioIngredientsRepository;
    constructor() {
        this.formulationRepository = new FormulationRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.productRepository = new ProductRepository();
        this.outputsDriedRepository = new OutputsDriefRepository();
        this.formulationIngredientsRepository = new FormulatioIngredientsRepository();
    }

    async createFormulation(req: Request) {
        console.log("holiaaa");
        let formulationDTO: FormulationDTO = req.body;
        if (!formulationDTO.productRoviandaId)
            throw new Error("[400],productRobiandaId is required");

        let productRovianda: ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(+formulationDTO.productRoviandaId);
        console.log(productRovianda);
        if (!productRovianda)
            throw new Error(`[409], Rovianda Product with id ${formulationDTO.productRoviandaId} was not found`)
        if (!formulationDTO.lotId)
            throw new Error("[400] lotId is required");
        if (!formulationDTO.temperature)
            throw new Error("[400] lotId is required");
        if (!formulationDTO.temperatureWater)
            throw new Error("[400] temperatureWater is required");
        if (!formulationDTO.assignmentLot.newLotId)
            throw new Error("[400] assigmentLot is missing newLotId attribute");
        if (!formulationDTO.assignmentLot.dateEntry)
            throw new Error("[400] assigmentLot is missing dateEntry attribute");

        formulationDTO.ingredient.forEach(ingredient => {
            if (!ingredient.ingredentId)
                throw new Error("[400] One of ingredients is missing ingredentId attribute");
            if (!ingredient.lotId)
                throw new Error("[400] One of ingredients is missing lotId attribute");
        });

        let formulationToSave: Formulation = {
            id: 0,
            loteInterno: formulationDTO.lotId,
            productRoviandaId: productRovianda,
            temp: formulationDTO.temperature,
            waterTemp: formulationDTO.temperatureWater,
            newLote: `${formulationDTO.assignmentLot.newLotId} ${formulationDTO.assignmentLot.dateEntry}`
        }
        try {
            let formulationSaved = await this.formulationRepository.saveFormulation(formulationToSave);
            for (let i = 0; i < formulationDTO.ingredient.length; i++) {

                let product: Product = await this.productRepository.getProductById(+formulationDTO.ingredient[i].ingredentId);

                if (product) {
                    console.log(product);
                    let outputDried: OutputsDrief = await this.outputsDriedRepository.getOutputsDriefById(+formulationDTO.ingredient[i].lotId);
                    if (outputDried) {
                        let formulationIngredients: FormulationIngredients = {
                            id: 0,
                            formulationId: formulationSaved,
                            lotId: outputDried,
                            productId: product
                        }
                        await this.formulationIngredientsRepository.saveFormulationIngredients(formulationIngredients);
                    }
                }


            }
        } catch (err) {
            console.log("asdadsadasd");
            console.log(err);
            throw new Error(`[500], ${err}`);
        }
    }
}