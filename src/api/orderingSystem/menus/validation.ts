import { Optional, getNumbersList } from "../../../helpers/general";
import ajv from "ajv";


export const MenuJsonKeys: {
    id: 'id',
    title: 'title',
    day_of_the_week: 'day_of_the_week',
    start_time: 'start_time',
    end_time: 'end_time',
    categories: 'categories',
    Categories: {
        title: 'title',
        product_ids: 'product_ids',
    }
} = {
    id: 'id',
    title: 'title',
    day_of_the_week: 'day_of_the_week',
    start_time: 'start_time',
    end_time: 'end_time',
    categories: 'categories',
    Categories: {
        title: 'title',
        product_ids: 'product_ids',
    }
}

export interface MenuJsonResponseObj{
    [MenuJsonKeys.id]: number;
    [MenuJsonKeys.title]: string;
    [MenuJsonKeys.day_of_the_week]: Optional<number>;
    [MenuJsonKeys.start_time]: Optional<string>;
    [MenuJsonKeys.end_time]: Optional<string>;
    [MenuJsonKeys.categories]: {
        [MenuJsonKeys.Categories.title]: string;
        [MenuJsonKeys.Categories.product_ids]: number[];
    }[];
}

const MenuApiResponseSchema = {

    startEndTimeType: {
        type: ['string', 'null'], 
        format: 'time'
    },

    type: 'object',
    properties: {
        [MenuJsonKeys.id]: {type: 'number'},
        [MenuJsonKeys.title]: {type: 'string'},
        [MenuJsonKeys.day_of_the_week]: {enum: [...getNumbersList(0, 6), null]},
        [MenuJsonKeys.start_time]: {'$ref': '#/startEndTimeType'},
        [MenuJsonKeys.end_time]: {'$ref': '#/startEndTimeType'},
        [MenuJsonKeys.categories]: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    [MenuJsonKeys.Categories.title]: {type: 'string'},
                    [MenuJsonKeys.Categories.product_ids]: {
                        type: 'array',
                        items: {type: 'number'}
                    }
                },
                required: [
                    MenuJsonKeys.Categories.title,
                    MenuJsonKeys.Categories.product_ids
                ],
            }
        }
    },
    required: [
        MenuJsonKeys.id,
        MenuJsonKeys.title,
        MenuJsonKeys.day_of_the_week,
        MenuJsonKeys.start_time,
        MenuJsonKeys.end_time,
        MenuJsonKeys.categories,
    ]
}

export const menuResponseObjValidator = (new ajv({allErrors: true}).compile(MenuApiResponseSchema));


