

import { TabBarSelection } from "./TabBarController/TabBar/helpers";


const AppSettings = {
    defaultTabBarSelection: TabBarSelection.tips,
    debugMode: false,
    apiHostUrl(){
        if (this.debugMode){
            return '127.0.0.1:8000';
        } else {
            return 'better-living-backend.herokuapp.com';
        }
    },
};

export default AppSettings;
