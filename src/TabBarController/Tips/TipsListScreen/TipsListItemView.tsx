
import React from 'react';
import { StyleSheet } from 'react-native';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import LayoutConstants from '../../../LayoutConstants';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { CustomColors } from '../../../helpers/colors';
import Spacer from '../../../helpers/Spacers/Spacer';
import { useNavigationScreenContext } from '../../../helpers/NavigationController/NavigationScreen';
import { mapOptional } from '../../../helpers/general';
import PresentableScreens from '../../../PresentableScreens';
import { useSelector } from '../../../redux/store';

interface TipsListItemViewProps{
    id: number,
}

const TipsListItemView = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
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
            fontSize: 20,
        },
        descriptionLabel: {
            color: CustomColors.offBlackSubtitle.stringValue,
        },
    });

    

    const TipsListItemView = (props: TipsListItemViewProps) => {

        const healthTip = useSelector(state => state.healthTips.get(props.id));

        const navigationScreenContext = useNavigationScreenContext();

        function onPress(){
            const healthTipID = healthTip?.id;
            if (healthTipID == null){return;}
            mapOptional(PresentableScreens.TipsDetailScreen(), Component => {
                return navigationScreenContext.present(<Component healthTipId={healthTipID}/>)
            });
        }

        return <BouncyButton
            style={styles.root}
            bounceScaleValue={0.925}
            contentViewProps={{ style: styles.buttonContentView }}
            onPress={onPress}
        >
            <Spacer space={10}>
                <CustomizedText style={styles.dateLabel}>{
                    healthTip?.getFormattedDateString()
                }</CustomizedText>
                <CustomizedText style={styles.titleLabel} numberOfLines={2}>
                    {healthTip?.title}
                </CustomizedText>
                <CustomizedText style={styles.descriptionLabel} numberOfLines={2}>
                    {healthTip?.articleText}
                </CustomizedText>
            </Spacer>
        </BouncyButton>
    }
    return TipsListItemView;
})();

export default TipsListItemView;
