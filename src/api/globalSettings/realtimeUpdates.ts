
import { updateGlobalSettingsAction } from "../../redux/globalSettings";
import store from "../../redux/store";
import GlobalSettings from "./GlobalSettings";


export function handleGlobalSettingsRealtimeUpdate(jsonData: any){
    if (jsonData == null || typeof jsonData !== 'object'){return;}

    const globalSettings = new GlobalSettings(jsonData);
    store.dispatch(updateGlobalSettingsAction(globalSettings));

}

