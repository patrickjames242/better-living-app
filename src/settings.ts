import { StatusBarStyle } from "react-native";




const AppSettings = {
    deliveryDriverPhoneNumber: '+1 (242) 333-3333',
    get deliveryDisclaimerMessage(){
        return `If you want your order delivered you MUST call our delivery driver at ${AppSettings.deliveryDriverPhoneNumber}, inform him of the order and give him your directions. You are also required to pay him a delivery fee with cash.`
    },
    useLocalHostDevServer: false,
    vatPercentage: 0.12,
    apiHostUrl(){
        if (this.useLocalHostDevServer){
            return '127.0.0.1:8000';
        } else {
            return 'better-living-backend.herokuapp.com';
        }
    },
    defaultStatusBarStyle: (() => {
        const x: StatusBarStyle = 'dark-content';
        return x;
    })(),
};

export default AppSettings;
   