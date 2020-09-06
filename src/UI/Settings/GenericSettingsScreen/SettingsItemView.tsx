import React from 'react';
import { StyleSheet, Image, ImageSourcePropType } from 'react-native';
import LayoutConstants from '../../../LayoutConstants';
import { Color, CustomColors } from '../../../helpers/colors';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import Spacer from '../../../helpers/Spacers/Spacer';



export interface SettingsItemViewProps {
    title: string;
    imageSource: ImageSourcePropType;
    onPress: () => void;
    rightSubtitleText?: string;
}

const SettingsItemView = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        buttonContentView: {
            backgroundColor: 'white',
            paddingLeft: 17.5,
            paddingRight: 17.5,
            paddingTop: 19,
            paddingBottom: 19,
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconImage: {
            width: 25,
            height: 25,
        },
        titleText: {
            fontFamily: CustomFont.medium,
            fontSize: 17,
        },
        subtitleText: {
            fontSize: 15,
            color: CustomColors.offBlackSubtitle.stringValue,
            fontFamily: CustomFont.medium,
            flex: 1,
            textAlign: 'right',
        },
        chevronIcon: {
            height: 12.5,
            width: 12.5,
            tintColor: Color.gray(0.7).stringValue,
        },
    });

    const SettingsItemView = (props: SettingsItemViewProps) => {
        return <BouncyButton
            bounceScaleValue={0.93}
            style={styles.root}
            contentViewProps={{ style: styles.buttonContentView }}
            onPress={props.onPress}
        >
            <Spacer space={10}>
                <Image style={styles.iconImage} source={props.imageSource} />
                <CustomizedText style={styles.titleText}>{props.title}</CustomizedText>
                <CustomizedText numberOfLines={1} style={styles.subtitleText}>{props.rightSubtitleText ?? ''}</CustomizedText>
                <Image style={styles.chevronIcon} source={require('./arrow.png')} />
            </Spacer>
        </BouncyButton>
    }
    return SettingsItemView;
})();

export default SettingsItemView;
