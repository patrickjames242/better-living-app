import React from 'react';
import InquiriesListScreen from './InquiriesListScreen/InquiriesListScreen';
import { InquiriesNavStack } from './navigationHelpers';
import InquiryDetailScreen from './InquiryDetailScreen/InquiryDetailScreen';
import { DEFAULT_NAV_SCREEN_OPTIONS } from '../../helpers/general';



export default function Inquiries() {
    return <InquiriesNavStack.Navigator initialRouteName="InquiriesList" screenOptions={DEFAULT_NAV_SCREEN_OPTIONS}>
        <InquiriesNavStack.Screen name="InquiriesList" component={InquiriesListScreen} />
        <InquiriesNavStack.Screen name="InquiryDetail" component={InquiryDetailScreen} />
    </InquiriesNavStack.Navigator>
}
