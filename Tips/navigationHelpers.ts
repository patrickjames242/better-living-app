import { Optional } from "../src/helpers/general";
import { createStackNavigator } from '@react-navigation/stack';



export type TipsNavStackParamList = {
    CreateOrEditTip: {tipIdToEdit: Optional<number>},
    TipDetail: {healthTipId: number},
    TipsList: undefined,
}

export const TipsNavStack = createStackNavigator<TipsNavStackParamList>();

