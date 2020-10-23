
import React from 'react';
import { StyleSheet } from 'react-native';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import LayoutConstants from '../../../LayoutConstants';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { CustomColors } from '../../../helpers/colors';
import Spacer from '../../../helpers/Spacers/Spacer';
import { useSelector } from '../../../redux/store';
import { useNavigation } from '@react-navigation/native';
import { TipsNavStackParamList } from '../navigationHelpers';
import { StackNavigationProp } from '@react-navigation/stack';

interface TipsListItemViewProps {
    id: number,
}

const TipsListItemView = (() => {

    const styles = StyleSheet.create({
        root: {
        },
        buttonContentView: {
            padding: LayoutConstants.floatingCellStyles.padding,
            backgroundColor: 'white',
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
        },
        dateLabel: {
            fontFamily: CustomFont.bold,
            color: CustomColors.themeGreen.stringValue,
            fontSize: 14,
            textTransform: 'uppercase',
        },
        titleLabel: {
            fontFamily: CustomFont.bold,
            fontSize: 17,
        },
        descriptionLabel: {
            color: CustomColors.offBlackSubtitle.stringValue,
        },
    });



    const TipsListItemView = (props: TipsListItemViewProps) => {

        const healthTip = useSelector(state => state.healthTips.get(props.id));

        const navigation = useNavigation<StackNavigationProp<TipsNavStackParamList, 'TipsList'>>();


        function onPress() {
            const healthTipId = healthTip?.id;
            if (healthTipId == null) { return; }

            navigation.push('TipDetail', { healthTipId })

        }

        return <BouncyButton
            style={styles.root}
            bounceScaleValue={0.925}
            contentViewProps={{ style: styles.buttonContentView }}
            onPress={onPress}
        >
            <Spacer space={7}>
                <CustomizedText style={styles.dateLabel}>{
                    healthTip?.getFormattedDateString()
                }</CustomizedText>
                <CustomizedText style={styles.titleLabel} numberOfLines={2}>
                    {healthTip?.title}
                </CustomizedText>
                {(healthTip?.articleText ?? '').trim().length >= 1 &&
                    <CustomizedText style={styles.descriptionLabel} numberOfLines={2}>
                        {healthTip?.articleText}
                    </CustomizedText>}
            </Spacer>
        </BouncyButton>
    }
    return TipsListItemView;
})();

export default TipsListItemView;
