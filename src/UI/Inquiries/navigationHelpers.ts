import { createStackNavigator } from '@react-navigation/stack';

export type InquiriesNavStackParams = {
  InquiriesMain: undefined;
  InquiryForm: undefined;
};

export const InquiriesNavStack =
  createStackNavigator<InquiriesNavStackParams>();
