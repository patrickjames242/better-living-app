import React from 'react';
import NavigationController from '../../helpers/NavigationController/NavigationController';
import InquiriesListScreen from './InquiriesListScreen/InquiriesListScreen';



export default function Inquiries(){
    return <NavigationController initialComponent={<InquiriesListScreen/>} />
}
