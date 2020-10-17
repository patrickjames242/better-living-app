
import React from 'react';
import TipsListScreen from './TipsListScreen/TipsListScreen';
import { TipsNavStack } from './navigationHelpers';
import CreateOrEditTipScreen from './CreateOrEditTipScreen/CreateOrEditTipScreen';
import TipsDetailScreen from './TipsDetailScreen/TipsDetailScreen';
import { DEFAULT_NAV_SCREEN_OPTIONS } from '../../helpers/general';



const Tips = React.memo(
    function _InnerTips() {
        return <TipsNavStack.Navigator initialRouteName="TipsList" screenOptions={DEFAULT_NAV_SCREEN_OPTIONS}>
            <TipsNavStack.Screen name="TipsList" component={TipsListScreen} />
            <TipsNavStack.Screen name="CreateOrEditTip" component={CreateOrEditTipScreen} />
            <TipsNavStack.Screen name="TipDetail" component={TipsDetailScreen} />
        </TipsNavStack.Navigator>
    }
);


export default Tips;
