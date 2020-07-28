

import {Optional} from '../../../helpers/general';
import ajv from 'ajv';


export const ProductJsonKeys: {
    id: 'id',
    title: 'title',
    description: 'description',
    image_url: 'image_url',
    individual_price: 'individual_price',
    info_tag_ids: 'info_tag_ids'
} = {
    id: 'id',
    title: 'title',
    description: 'description',
    image_url: 'image_url',
    individual_price: 'individual_price',
    info_tag_ids: 'info_tag_ids'
}

export interface ProductJsonResponseObj{

    [ProductJsonKeys.id]: number;
    [ProductJsonKeys.title]: string;
    [ProductJsonKeys.description]: Optional<string>;
    [ProductJsonKeys.image_url]: Optional<string>;
    [ProductJsonKeys.individual_price]: Optional<number>;
    [ProductJsonKeys.info_tag_ids]: number[];

}

const ProductApiResponseSchema = {
    type: 'object',
    properties: {
        [ProductJsonKeys.id]: {type: 'number'},
        [ProductJsonKeys.title]: {type: 'string'},
        [ProductJsonKeys.description]: {type: ['string', 'null']},
        [ProductJsonKeys.image_url]: {type: ['string', 'null'], format: 'uri'},
        [ProductJsonKeys.individual_price]: {type: ['number', 'null']},
        [ProductJsonKeys.info_tag_ids]: {
            type: 'array',
            items: {type: 'number'}
        }
    },
    required: [
        ProductJsonKeys.id,
        ProductJsonKeys.title,
        ProductJsonKeys.description,
        ProductJsonKeys.image_url,
        ProductJsonKeys.individual_price,
        ProductJsonKeys.info_tag_ids,
    ]
}

export const productResponseObjValidator = (new ajv({allErrors: true})).compile(ProductApiResponseSchema);


