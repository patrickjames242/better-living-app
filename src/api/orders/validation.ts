import ajv from "ajv";
import { Optional } from "../../helpers/general";


export const OrderJsonKeys: {
    User: {
        first_name: 'first_name',
        last_name: 'last_name',
        email: 'email',
        phone_number: 'phone_number',
    },
    DetailsJson: {
        entry_type: 'entry_type',
        quantity: 'quantity',
        EntryType: {
            product: 'product',
            meal: 'meal',
        },
        ProductEntry: {
            product_name: 'product_name',
            product_price: 'product_price',
        },
        MealEntry: {
            meal_name: 'meal_name',
            meal_price: 'meal_price',
            choices: 'choices',
            Choice: {
                category_name: 'category_name',
                chosen_product_name: 'chosen_product_name',
            }
        }
    },
    id: 'id',
    user: 'user',
    creation_date: 'creation_date',
    details_json: 'details_json',
    user_notes: 'user_notes',
    is_completed: 'is_completed',
    order_num: 'order_num',
    subtotal_charged: 'subtotal_charged',
    vat_charged: 'vat_charged',
    delivery_fee_charged: 'delivery_fee_charged',
    delivery_directions: 'delivery_directions',
    user_paid_online: 'user_paid_online',
    user_wants_order_delivered: 'user_wants_order_delivered',
} = {
    User: {
        first_name: 'first_name',
        last_name: 'last_name',
        email: 'email',
        phone_number: 'phone_number',
    },
    DetailsJson: {
        EntryType: {
            product: 'product',
            meal: 'meal',
        },
        entry_type: 'entry_type',
        quantity: 'quantity',
        ProductEntry: {
            product_name: 'product_name',
            product_price: 'product_price',
        },
        MealEntry: {
            meal_name: 'meal_name',
            meal_price: 'meal_price',
            choices: 'choices',
            Choice: {
                category_name: 'category_name',
                chosen_product_name: 'chosen_product_name',
            }
        }
    },
    id: 'id',
    user: 'user',
    creation_date: 'creation_date',
    details_json: 'details_json',
    user_notes: 'user_notes',
    is_completed: 'is_completed',
    order_num: 'order_num',
    subtotal_charged: 'subtotal_charged',
    vat_charged: 'vat_charged',
    delivery_fee_charged: 'delivery_fee_charged',
    delivery_directions: 'delivery_directions',
    user_paid_online: 'user_paid_online',
    user_wants_order_delivered: 'user_wants_order_delivered',
}


export interface OrderJsonResponseObj{
    [OrderJsonKeys.id]: string;
    [OrderJsonKeys.user]: {
        [OrderJsonKeys.User.first_name]: string;
        [OrderJsonKeys.User.last_name]: string;
        [OrderJsonKeys.User.email]: string;
        [OrderJsonKeys.User.phone_number]: string;
    };
    [OrderJsonKeys.creation_date]: string;
    [OrderJsonKeys.details_json]: ({
        [OrderJsonKeys.DetailsJson.entry_type]: typeof OrderJsonKeys['DetailsJson']['EntryType']['meal'];
        [OrderJsonKeys.DetailsJson.quantity]: number;
        [OrderJsonKeys.DetailsJson.MealEntry.meal_name]: string;
        [OrderJsonKeys.DetailsJson.MealEntry.meal_price]: number;
        [OrderJsonKeys.DetailsJson.MealEntry.choices]: {
            [OrderJsonKeys.DetailsJson.MealEntry.Choice.category_name]: string;
            [OrderJsonKeys.DetailsJson.MealEntry.Choice.chosen_product_name]: string;
        }[];
    } | {
        [OrderJsonKeys.DetailsJson.entry_type]: typeof OrderJsonKeys['DetailsJson']['EntryType']['product'];
        [OrderJsonKeys.DetailsJson.quantity]: number;
        [OrderJsonKeys.DetailsJson.ProductEntry.product_name]: string;
        [OrderJsonKeys.DetailsJson.ProductEntry.product_price]: number;
    })[];
    [OrderJsonKeys.user_notes]: Optional<string>;
    [OrderJsonKeys.is_completed]: boolean;
    [OrderJsonKeys.order_num]: number;
    [OrderJsonKeys.subtotal_charged]: Optional<number>;
    [OrderJsonKeys.vat_charged]: Optional<number>;
    [OrderJsonKeys.delivery_fee_charged]: Optional<number>,
    [OrderJsonKeys.delivery_directions]: Optional<string>,
    [OrderJsonKeys.user_paid_online]: boolean;
    [OrderJsonKeys.user_wants_order_delivered]: boolean;
}

export const OrderDetailsJsonResponseSchema = {
    'type': 'array',
    'minItems': 1,
    'items': {
        'oneOf': [
            {
                'type': 'object',
                'properties': {
                    'entry_type': {'enum': ['product']},
                    'product_name': {'type': 'string'},
                    'product_price': {'type': 'number', 'minimum': 0},
                    'quantity': {'type': 'integer', 'minimum': 1},
                },
                'required': [
                    'entry_type',
                    'product_name',
                    'product_price',
                    'quantity',
                ],
            },
            {
                'type': 'object',
                'properties': {
                    'entry_type': {'enum': ['meal']},
                    'meal_name': {'type': 'string'},
                    'meal_price': {'type': 'number'},
                    'quantity': {'type': 'integer', 'minimum': 1},
                    'choices': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'category_name': {'type': 'string'},
                                'chosen_product_name': {'type': 'string'},
                            },
                            'required': [
                                'category_name',
                                'chosen_product_name',
                            ]
                        }
                    }
                },
                'required': [
                    'entry_type',
                    'meal_name',
                    'meal_price',
                    'quantity',
                    'choices'
                ]
            }
        ]
    },
}

export const OrderApiResponseSchema = {
    type: 'object',
    properties: {
        [OrderJsonKeys.id]: {type: 'string'},
        [OrderJsonKeys.user]: {
            type: 'object',
            properties: {
                [OrderJsonKeys.User.first_name]: {type: 'string'},
                [OrderJsonKeys.User.last_name]: {type: 'string'},
                [OrderJsonKeys.User.email]: {type: 'string'},
                [OrderJsonKeys.User.phone_number]: {type: 'string'},
            },
            required: [
                OrderJsonKeys.User.first_name,
                OrderJsonKeys.User.last_name,
                OrderJsonKeys.User.email,
                OrderJsonKeys.User.phone_number,
            ],
        },
        [OrderJsonKeys.creation_date]: {type: 'string', format: 'date-time'},
        [OrderJsonKeys.details_json]: OrderDetailsJsonResponseSchema,
        [OrderJsonKeys.user_notes]: {type: ['string', 'null']},
        [OrderJsonKeys.is_completed]: {type: 'boolean'},
        [OrderJsonKeys.order_num]: {type: 'number'},
        [OrderJsonKeys.subtotal_charged]: {type: ['number', 'null']},
        [OrderJsonKeys.vat_charged]: {type: ['number', 'null']},
        [OrderJsonKeys.delivery_fee_charged]: {type: ['number', 'null']},
        [OrderJsonKeys.delivery_directions]: {type: ['string', 'null']},
        [OrderJsonKeys.user_paid_online]: {type: 'boolean'},
        [OrderJsonKeys.user_wants_order_delivered]: {type: 'boolean'},
    },
    required: [
        OrderJsonKeys.id,
        OrderJsonKeys.user,
        OrderJsonKeys.creation_date,
        OrderJsonKeys.details_json,
        OrderJsonKeys.user_notes,
        OrderJsonKeys.is_completed,
        OrderJsonKeys.order_num,
        OrderJsonKeys.subtotal_charged,
        OrderJsonKeys.vat_charged,
        OrderJsonKeys.delivery_fee_charged,
        OrderJsonKeys.delivery_directions,
        OrderJsonKeys.user_paid_online,
        OrderJsonKeys.user_wants_order_delivered,
    ]
}

export const orderResponseObjValidator = (new ajv({allErrors: true})).compile(OrderApiResponseSchema);


