import { ValidateFunction } from "ajv";
import { getJsonValidatorErrorsText } from "../helpers/general";



export default function getErrorObjFromApiObjValidateFunction(validator: ValidateFunction, apiObjName: string){
    const errorMessage = (() => {
        const errorsText = getJsonValidatorErrorsText(validator);
        const beginningText = `An error occured when trying to parse a ${apiObjName} api response object.`;
        if (errorsText == null){return beginningText;}
        return [beginningText, 'Here is the error ->', errorsText].join(' ');
    })();
    return new Error(errorMessage);
}

export function assertValidObjFromApi(validator: ValidateFunction, apiObjName: string, json: any){
    if (validator(json) === false){
        throw getErrorObjFromApiObjValidateFunction(validator, apiObjName);
    }
}

