
import React from 'react';
import { StyleSheet } from 'react-native';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import CustomizedText from '../../../helpers/CustomizedText';
import LayoutConstants from '../../../LayoutConstants';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { CustomColors } from '../../../helpers/colors';
import Spacer from '../../../helpers/Spacers/Spacer';
import { useNavigationScreenContext } from '../../../helpers/NavigationController/NavigationScreen';
import { mapOptional } from '../../../helpers/general';
import PresentableScreens from '../../../PresentableScreens';



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

    const TipsListItemView = () => {


        const navigationScreenContext = useNavigationScreenContext();

        function onPress(){
            mapOptional(PresentableScreens.TipsDetailScreen(), Component => navigationScreenContext.present(<Component/>));
        }


        return <BouncyButton
            style={styles.root}
            bounceScaleValue={0.925}
            contentViewProps={{ style: styles.buttonContentView }}
            onPress={onPress}
        >
            <Spacer space={10}>
                <CustomizedText style={styles.dateLabel}>Sept 27, 2020</CustomizedText>
                <CustomizedText style={styles.titleLabel}>
                    Improving Rationality through culture rather than education
                </CustomizedText>
                <CustomizedText style={styles.descriptionLabel}>
                    Lorem ipsum dolor, sit amet conse ctetur adipis icing elit. Quis, repudi andae?
                </CustomizedText>
            </Spacer>
        </BouncyButton>
    }
    return TipsListItemView;
})();

export default TipsListItemView;
