import React from 'react';
import { InquiriesNavStack } from './navigationHelpers';
import { DEFAULT_NAV_SCREEN_OPTIONS } from '../../helpers/general';
import InquiriesMainScreen from './InquiriesMainScreen/InquiriesMainScreen';
import InquiryFormScreen from './InquiryFormScreen/InquiryFormScreen';

const Inquiries = () => {
  return (
    <InquiriesNavStack.Navigator
      initialRouteName="InquiriesMain"
      screenOptions={DEFAULT_NAV_SCREEN_OPTIONS}
    >
      <InquiriesNavStack.Screen
        name="InquiriesMain"
        component={InquiriesMainScreen}
      />
      <InquiriesNavStack.Screen
        name="InquiryForm"
        component={InquiryFormScreen}
      />
    </InquiriesNavStack.Navigator>
  );
};

export default React.memo(Inquiries);
