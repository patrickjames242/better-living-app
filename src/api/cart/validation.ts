import ajv from 'ajv';

const CartProductEntryJsonKeys: {
    id: 'id',
    product_id: 'product_id',
    date_created: 'date_created',
    quantity: 'quantity',
} = {
    id: 'id',
    product_id: 'product_id',
    date_created: 'date_created',
    quantity: 'quantity',
};

export interface CartProductEntryResponseObj{
    [CartProductEntryJsonKeys.id]: string;
    [CartProductEntryJsonKeys.product_id]: number;
    [CartProductEntryJsonKeys.date_created]: string;
    [CartProductEntryJsonKeys.quantity]: number;
}

export const CartProductEntryAPIResponseSchema = {
    type: 'object',
    properties: {
        [CartProductEntryJsonKeys.id]: {type: 'string'},
        [CartProductEntryJsonKeys.product_id]: {type: 'integer'},
        [CartProductEntryJsonKeys.date_created]: {
            type: 'string',
            format: 'date-time',
        },
        [CartProductEntryJsonKeys.quantity]: {type: 'integer'},
    },
    required: [
        CartProductEntryJsonKeys.id,
        CartProductEntryJsonKeys.product_id,
        CartProductEntryJsonKeys.date_created,
        CartProductEntryJsonKeys.quantity,
    ]
}









const CartMealEntryJsonKeys: {
    id: 'id',
    date_created: 'date_created',
    quantity: 'quantity',
    meal_id: 'meal_id',
    choices: 'choices',
    Choice: {
        meal_product_category_id: 'meal_product_category_id',
        chosen_product_id: 'chosen_product_id',
    }
} = {
    id: 'id',
    date_created: 'date_created',
    quantity: 'quantity',
    meal_id: 'meal_id',
    choices: 'choices',
    Choice: {
        meal_product_category_id: 'meal_product_category_id',
        chosen_product_id: 'chosen_product_id',
    }
}

export interface CartMealEntryJsonResponseObj{
    [CartMealEntryJsonKeys.id]: string;
    [CartMealEntryJsonKeys.date_created]: string;
    [CartMealEntryJsonKeys.quantity]: number;
    [CartMealEntryJsonKeys.meal_id]: number;
    [CartMealEntryJsonKeys.choices]: {
        [CartMealEntryJsonKeys.Choice.meal_product_category_id]: number;
        [CartMealEntryJsonKeys.Choice.chosen_product_id]: number;
    }[];
}

export const CartMealEntryAPIResponseSchema = {
    type: 'object',
    properties: {
        [CartMealEntryJsonKeys.id]: {type: 'string'},
        [CartMealEntryJsonKeys.date_created]: {
            type: 'string',
            format: 'date-time'
        },
        [CartMealEntryJsonKeys.quantity]: {type: 'integer'},
        [CartMealEntryJsonKeys.meal_id]: {type: 'integer'},
        [CartMealEntryJsonKeys.choices]: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    [CartMealEntryJsonKeys.Choice.meal_product_category_id]: {type: 'integer'},
                    [CartMealEntryJsonKeys.Choice.chosen_product_id]: {type: 'integer'},
                },
                required: [
                    CartMealEntryJsonKeys.Choice.meal_product_category_id,
                    CartMealEntryJsonKeys.Choice.chosen_product_id,
                ]
            }
        }
    },
    required: [
        CartMealEntryJsonKeys.id,
        CartMealEntryJsonKeys.date_created,
        CartMealEntryJsonKeys.quantity,
        CartMealEntryJsonKeys.meal_id,
        CartMealEntryJsonKeys.choices,
    ]
}







export const cartProductEntryResponseObjValidator = (new ajv({allErrors: true})).compile(CartProductEntryAPIResponseSchema);


export const cartMealEntryResponseObjValidator = (new ajv({allErrors: true})).compile(CartMealEntryAPIResponseSchema);
