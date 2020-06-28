
import React from 'react';
import {StyleSheet} from 'react-native';
import LongTextAndIconButton from '../../../helpers/Buttons/GreenTextAndIconButton';
import AssetImages from '../../../images/AssetImages';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import LayoutConstants from '../../../LayoutConstants';
import { CustomColors } from '../../../helpers/colors';
import { deleteHealthTip } from '../../../api/healthTips/requests';
import { useNavigationScreenContext } from '../../../helpers/NavigationController/NavigationScreen';
import { mapOptional } from '../../../helpers/general';
import PresentableScreens from '../../../PresentableScreens';

export interface TipsDetailBottomButtonsViewProps{
    healthTipId: number;
}

const TipsDetailBottomButtonsView = (() => {
    
    const styles = StyleSheet.create({
        root: {
            maxWidth: LayoutConstants.bottomScreenButtonWithGradient.maxWidth,
            alignSelf: 'center',
            width: '100%',
        },
    });
    
    const TipsDetailBottomButtonsView = (props: TipsDetailBottomButtonsViewProps) => {

        const navigationScreenContext = useNavigationScreenContext();

        function editButtonPressed(){
            mapOptional(PresentableScreens.CreateOrEditTipScreen(), Component => navigationScreenContext.present(<Component tipIdToEdit={props.healthTipId}/>))
        }

        function deleteButtonPressed(){
            deleteHealthTip(props.healthTipId);
        }

        return <SpacerView style={styles.root} space={10}>
            <LongTextAndIconButton text="Edit Health Tip" iconSource={AssetImages.editIcon} onPress={editButtonPressed}/>
            <LongTextAndIconButton text="Delete Health Tip" iconSource={AssetImages.deleteIcon} backgroundColor={CustomColors.redColor} onPress={deleteButtonPressed}/>
        </SpacerView>
    }
    return TipsDetailBottomButtonsView;
})();

export default TipsDetailBottomButtonsView;
