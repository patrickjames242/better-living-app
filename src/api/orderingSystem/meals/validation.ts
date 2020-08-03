import ajv from "ajv"


export const MealJsonKeys: {
    id: 'id',
    title: 'title',
    price: 'price',
    product_categories: 'product_categories',
    ProductCategory: {
        id: 'id',
        order_num: 'order_num',
    }
} = {
    id: 'id',
    title: 'title',
    price: 'price',
    product_categories: 'product_categories',
    ProductCategory: {
        id: 'id',
        order_num: 'order_num',
    }
}

export interface MealJsonResponseObj{
    [MealJsonKeys.id]: number;
    [MealJsonKeys.title]: string;
    [MealJsonKeys.price]: number;
    [MealJsonKeys.product_categories]: {
        [MealJsonKeys.ProductCategory.id]: number;
        [MealJsonKeys.ProductCategory.order_num]: number;
    }[]
}


const MealApiResponseSchema = {
    type: 'object',
    properties: {
        [MealJsonKeys.id]: {type: 'number'},
        [MealJsonKeys.title]: {type: 'string'},
        [MealJsonKeys.price]: {type: 'number'},
        [MealJsonKeys.product_categories]: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    [MealJsonKeys.ProductCategory.id]: {type: 'number'},
                    [MealJsonKeys.ProductCategory.order_num]: {type: 'number'},
                },
                additionalProperties: false,
                required: [
                    MealJsonKeys.ProductCategory.id,
                    MealJsonKeys.ProductCategory.order_num,
                ],
            }
        }
    },
    required: [
        MealJsonKeys.id,
        MealJsonKeys.title,
        MealJsonKeys.price,
        MealJsonKeys.product_categories,
    ],
    additionalProperties: false,
}

export const mealResponseObjValidator = (new ajv({allErrors: true})).compile(MealApiResponseSchema);

