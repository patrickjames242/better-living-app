
import React, { useState } from 'react';
import {StyleSheet} from 'react-native';
import LongTextAndIconButton from '../../src/helpers/Buttons/LongTextAndIconButton';
import AssetImages from '../../src/images/AssetImages';
import SpacerView from '../../src/helpers/Spacers/SpacerView';
import LayoutConstants from '../../src/LayoutConstants';
import { CustomColors } from '../../src/helpers/colors';
import { deleteHealthTip } from '../../src/api/healthTips/requests';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TipsNavStackParamList } from '../navigationHelpers';
import { useIsUnmounted } from '../../src/helpers/reactHooks';
import { displayErrorMessage } from '../../src/helpers/Alerts';

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


        const [deleteIsLoading, setDeleteIsLoading] = useState(false);

        const navigation = useNavigation<StackNavigationProp<TipsNavStackParamList, 'TipDetail'>>();

        function editButtonPressed(){
            navigation.push('CreateOrEditTip', {tipIdToEdit: props.healthTipId})            
        }

        const isUnmounted = useIsUnmounted();

        function deleteButtonPressed(){
            setDeleteIsLoading(true);
            deleteHealthTip(props.healthTipId).catch(error => {
                displayErrorMessage(error.message);
            }).finally(() => {
                if (isUnmounted.current === false){
                    setDeleteIsLoading(false);
                }
            });
        }

        return <SpacerView style={styles.root} space={10}>
            <LongTextAndIconButton text="Edit Health Tip" iconSource={AssetImages.editIcon} onPress={editButtonPressed}/>
            <LongTextAndIconButton text="Delete Health Tip" iconSource={AssetImages.deleteIcon} backgroundColor={CustomColors.redColor} onPress={deleteButtonPressed} isLoading={deleteIsLoading}/>
        </SpacerView>
    }
    return TipsDetailBottomButtonsView;
})();

export default TipsDetailBottomButtonsView;
