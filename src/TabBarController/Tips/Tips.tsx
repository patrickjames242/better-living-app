
import React from 'react';
import NavigationController from '../../helpers/NavigationController/NavigationController';
import TipsListScreen from './TipsListScreen/TipsListScreen';



const Tips = React.memo(
    function _InnerTips() {
        return <NavigationController initialComponent={<TipsListScreen />} />
    }
);


export default Tips;
