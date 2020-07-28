import { ProductInfoTagJsonResponseObj } from "./validation";
import ProductInfoTag from "./ProductInfoTag";



export function getProductInfoTagFromJsonResponseObj_orNull(apiResponseObj: ProductInfoTagJsonResponseObj){
    try{
        return new ProductInfoTag(apiResponseObj);
    } catch (error){
        console.error('A product info tag could not be converted from json because of the following error ->', error, apiResponseObj);
        return null;
    }
}

