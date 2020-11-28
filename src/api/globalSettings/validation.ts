
import ajv from "ajv"


export const GlobalSettingsJsonKeys: {
    readonly is_ordering_system_enabled: 'is_ordering_system_enabled',
    readonly delivery_fee: 'delivery_fee',
    readonly vat_percentage: 'vat_percentage',
} = {
    is_ordering_system_enabled: 'is_ordering_system_enabled',
    delivery_fee: 'delivery_fee',
    vat_percentage: 'vat_percentage',
}


export interface GlobalSettingsResponseObj{
    [GlobalSettingsJsonKeys.is_ordering_system_enabled]: boolean;
    [GlobalSettingsJsonKeys.delivery_fee]: number;
    [GlobalSettingsJsonKeys.vat_percentage]: number;
}

const GlobalSettingsResponseSchema = {
    type: 'object',
    properties: {
        [GlobalSettingsJsonKeys.is_ordering_system_enabled]: {'type': 'boolean'},
        [GlobalSettingsJsonKeys.delivery_fee]: {'type': 'number'},
        [GlobalSettingsJsonKeys.vat_percentage]: {'type': 'number'},
    },
    required: [
        GlobalSettingsJsonKeys.is_ordering_system_enabled,
        GlobalSettingsJsonKeys.delivery_fee,
        GlobalSettingsJsonKeys.vat_percentage,
    ]
}

export const globalSettingsResponseObjValidator = (new ajv({allErrors: true})).compile(GlobalSettingsResponseSchema);
