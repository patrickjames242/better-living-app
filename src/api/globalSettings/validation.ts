
import ajv from "ajv"


export const GlobalSettingsJsonKeys: {
    readonly is_ordering_system_enabled: 'is_ordering_system_enabled',
} = {
    is_ordering_system_enabled: 'is_ordering_system_enabled',
}


export interface GlobalSettingsResponseObj{
    [GlobalSettingsJsonKeys.is_ordering_system_enabled]: boolean;
}

const GlobalSettingsResponseSchema = {
    type: 'object',
    properties: {
        [GlobalSettingsJsonKeys.is_ordering_system_enabled]: {'type': 'boolean'},
    },
    required: [
        GlobalSettingsJsonKeys.is_ordering_system_enabled,
    ]
}

export const globalSettingsResponseObjValidator = (new ajv({allErrors: true})).compile(GlobalSettingsResponseSchema);
