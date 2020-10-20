
import getErrorObjFromApiObjValidateFunction from "../helpers";
import { GlobalSettingsResponseObj as GlobalSettingsJsonResponseObj, globalSettingsResponseObjValidator } from "./validation";


export default class GlobalSettings{

    readonly isOrderingSystemEnabled: boolean;

    constructor(response: GlobalSettingsJsonResponseObj){
        if (globalSettingsResponseObjValidator(response) === false){
            throw getErrorObjFromApiObjValidateFunction(globalSettingsResponseObjValidator, 'Global Settings');
        }
        const json = response;

        this.isOrderingSystemEnabled = json.is_ordering_system_enabled;
    }
}

