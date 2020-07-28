
import { productInfoTagResponseObjValidator } from "./validation";
import getErrorObjFromApiObjValidateFunction from "../../helpers";



export default class ProductInfoTag{

    readonly id: number;
    readonly title: string;

    constructor(productInfoTagJsonResponseObj: ProductInfoTag){
        if (productInfoTagResponseObjValidator(productInfoTagJsonResponseObj) === false){
            throw getErrorObjFromApiObjValidateFunction(productInfoTagResponseObjValidator, 'ProductInfoTag');
        }

        const json = productInfoTagJsonResponseObj;

        this.id = json.id;
        this.title = json.title;
    }

}

