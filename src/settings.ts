

import { TabBarSelection } from "./UI/TabBarController/TabBar/helpers";


const AppSettings = {
    defaultTabBarSelection: TabBarSelection.menu,
    useLocalHostDevServer: true,
    useTestDatabaseData: false,
    vatPercentage: 0.12,
    apiHostUrl(){
        if (this.useLocalHostDevServer){
            return '127.0.0.1:8000';
        } else {
            return 'better-living-backend.herokuapp.com';
        }
    },
};

export default AppSettings;
