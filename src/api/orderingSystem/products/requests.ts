
import {ProductJsonKeys, ProductFormDataKeys } from "./validation";
import { getPropsFromObject, Optional } from "../../../helpers/general";
import { fetchFromAPI, HttpMethod } from "../../api";
import Product from "./Product";
import store from "../../../redux/store";
import { insertOrUpdateProductAction, deleteProductAction } from "../../../redux/orderingSystem/products";


const basePath = 'ordering-system/products/';

interface ProductRequestObj{
    [ProductJsonKeys.title]: string;
    [ProductJsonKeys.description]?: Optional<string>;
    [ProductJsonKeys.individual_price]?: Optional<string>;
    [ProductJsonKeys.should_be_sold_individually]?: boolean;
    [ProductJsonKeys.info_tag_ids]?: number[];
    setImage?: File | null; // a null value removes the image in the api
}

function getBodyForRequestObject(obj: Partial<ProductRequestObj>): FormData{
    const json: object | undefined = (() => {
        const filteredObj = getPropsFromObject(obj, [
            ProductJsonKeys.title,
            ProductJsonKeys.description,
            ProductJsonKeys.individual_price,
            ProductJsonKeys.info_tag_ids,
        ]);
        return Object.getOwnPropertyNames(filteredObj).length >= 1 ? filteredObj : undefined;
    })();

    const formData = new FormData();
    json && formData.append(ProductFormDataKeys.json, JSON.stringify(json));

    const setImageValue: File | 'null' | undefined = (() => {
        if (obj.setImage === null){return 'null';}
        else if (obj.setImage instanceof File){return obj.setImage}
    })();

    setImageValue && formData.append(ProductFormDataKeys.set_image, JSON.stringify(json));
    return formData;
}


export function createNewProduct(productInfo: ProductRequestObj){
    return fetchFromAPI({
        method: HttpMethod.post,
        path: basePath + 'create/',
        rawBody: getBodyForRequestObject(productInfo),
    }).then(response => {
        const product = new Product(response);
        store.dispatch(insertOrUpdateProductAction(product));
        return product;
    })
}


export function updateProduct(id: number, productInfo: Partial<ProductRequestObj>){
    return fetchFromAPI({
        method: HttpMethod.put,
        path: basePath + id + '/',
        rawBody: getBodyForRequestObject(productInfo),
    }).then(response => {
        const product = new Product(response);
        store.dispatch(insertOrUpdateProductAction(product));
        return product;
    });
}

export function deleteProduct(id: number){
    return fetchFromAPI({
        method: HttpMethod.delete,
        path: basePath + id + '/',
    }).then(() => store.dispatch(deleteProductAction(id)));
}


