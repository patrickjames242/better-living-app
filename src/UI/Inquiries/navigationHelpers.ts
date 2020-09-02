import { createStackNavigator } from "@react-navigation/stack"


export type InquiriesNavStackParams = {
    InquiryDetail: undefined;
    InquiriesList: undefined;
}

export const InquiriesNavStack = createStackNavigator<InquiriesNavStackParams>();

