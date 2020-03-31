import {UserController} from '../Controllers/User.Controller';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { CategoryController } from '../Controllers/Category.Controller';
import { ProductController } from '../Controllers/Product.Controller';
import { ProductSaleController } from '../Controllers/ProductSale.Controller';
import { CondimentController } from '../Controllers/Condiment.Controller';
import { QualifyController } from '../Controllers/Qualify.Controller';
import { QuestionController } from '../Controllers/Question.Controller';
import { ExtraController } from '../Controllers/Extra.Controller';
import { OrderController } from '../Controllers/Order.Controller';

export class Initializer{
    private userController:UserController;
    private firebaseInstance: FirebaseHelper;
    private categoryController:CategoryController;
    private productController:ProductController;
    private productSaleController:ProductSaleController;
    private condimentController:CondimentController;
    private qualifyController:QualifyController;
    private questionController:QuestionController;
    private extraController:ExtraController;
    private orderController:OrderController;
    
    constructor(){
        this.firebaseInstance = new FirebaseHelper();
        this.categoryController = new CategoryController(this.firebaseInstance);
        this.userController = new UserController(this.firebaseInstance);
        this.productController = new ProductController(this.firebaseInstance);
        this.productSaleController = new ProductSaleController();
        this.condimentController = new CondimentController();
        this.qualifyController = new QualifyController();
        this.questionController = new QuestionController();
        this.extraController = new ExtraController();
        this.orderController = new OrderController(this.firebaseInstance);
    }

    getController(prototype:string){
        switch(prototype){
            case UserController.name:
                return this.userController;
                break;
            case CategoryController.name:
                return this.categoryController;
                break;
            case ProductSaleController.name:
                return this.productSaleController;
                break;
            case ProductController.name:
                return this.productController;
                break;
            case CondimentController.name:
                return this.condimentController;
                break;
            case QualifyController.name:
                return this.qualifyController;
                break;
            case QuestionController.name:
                return this.questionController;
                break;
            case OrderController.name:
                return this.orderController;
                break;
            case ExtraController.name:
                return this.extraController;
                break;
            default:
                return null;
                break;
        }
    }
}