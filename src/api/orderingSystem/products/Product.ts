
import { Optional } from "../../../helpers/general";
import { ProductJsonResponseObj, productResponseObjValidator } from './validation';
import { Set } from "immutable";
import getErrorObjFromApiObjValidateFunction from "../../helpers";


export default class Product{

    readonly id: number;
    readonly title: string;
    readonly description: Optional<string>;
    readonly imageUrl: Optional<string>;
    readonly individualPrice: Optional<number>;
    readonly infoTagIds: Set<number>;

    constructor(productJsonResponseObj: ProductJsonResponseObj){

        if (productResponseObjValidator(productJsonResponseObj) === false){
            throw getErrorObjFromApiObjValidateFunction(productResponseObjValidator, 'Product');
        }

        const json = productJsonResponseObj;

        this.id = json.id;
        this.title = json.title;
        this.description = json.description;
        this.imageUrl = json.image_url;
        this.individualPrice = json.individual_price;
        this.infoTagIds = Set(json.info_tag_ids);

    }

}

