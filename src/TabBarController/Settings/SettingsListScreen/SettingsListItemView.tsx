import React from 'react';
import { StyleSheet, Image } from 'react-native';
import LayoutConstants from '../../../LayoutConstants';
import { Color } from '../../../helpers/colors';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import Spacer from '../../../helpers/Spacers/Spacer';


export interface SettingsListItemViewProps {

}

const SettingsListItemView = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        buttonContentView: {
            backgroundColor: 'white',
            paddingLeft: 17.5,
            paddingRight: 17.5,
            paddingTop: 20,
            paddingBottom: 20,
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconImage: {
            width: 25,
            height: 25,
        },
        text: {
            fontFamily: CustomFont.medium,
            fontSize: 17,
            flex: 1,
        },
        chevronIcon: {
            height: 12.5,
            width: 12.5,
            tintColor: Color.gray(0.7).stringValue,
        },
    });

    const SettingsListItemView = (props: SettingsListItemViewProps) => {
        return <BouncyButton
            bounceScaleValue={0.93}
            style={styles.root}
            contentViewProps={{ style: styles.buttonContentView }}
        >
            <Spacer space={10}>
                <Image style={styles.iconImage} source={require('./notification.png')} />
                <CustomizedText style={styles.text}>Notifications</CustomizedText>
                <Image style={styles.chevronIcon} source={require('./arrow.png')} />
            </Spacer>
        </BouncyButton>
    }
    return SettingsListItemView;
})();

export default SettingsListItemView;
