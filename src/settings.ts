

import { TabBarSelection } from "./UI/TabBarController/TabBar/helpers";


const AppSettings = {
    defaultTabBarSelection: TabBarSelection.menu,
    useLocalHostDevServer: false,
    useTestDatabaseData: false,
    apiHostUrl(){
        if (this.useLocalHostDevServer){
            return '127.0.0.1:8000';
        } else {
            return 'better-living-backend.herokuapp.com';
        }
    },
};

export default AppSettings;
