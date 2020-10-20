import React, { useState } from 'react';
import { StyleSheet, Image, ImageSourcePropType } from 'react-native';
import LayoutConstants from '../../../LayoutConstants';
import { Color, CustomColors } from '../../../helpers/colors';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import Spacer from '../../../helpers/Spacers/Spacer';
import CustomActivityIndicator from '../../../helpers/Views/ActivityIndicator';
import { CustomSwitch } from '../../../helpers/Views/CustomSwitch';



export interface SettingsItemViewProps {
    title: string;
    imageSource: ImageSourcePropType;
    onPress?: () => void;
    rightSubtitleText?: string;
    rightSwitchInfo?: {
        isOnValue: boolean,
        onValueChange: (isOn: boolean) => void | Promise<any>;
    }
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
        
        const [isLoading, setIsLoading] = useState(false);

        return <BouncyButton
            isPressAnimationEnabled={props.rightSwitchInfo == null}
            bounceScaleValue={0.93}
            style={styles.root}
            contentViewProps={{ style: styles.buttonContentView }}
            onPress={props.onPress}
        >
            {/* eslint-disable-next-line react/no-children-prop */}
            <Spacer space={10} children={[
                <Image key={1} style={styles.iconImage} source={props.imageSource} />,
                <CustomizedText key={2} style={[styles.titleText, {
                    flex: (isLoading || props.rightSwitchInfo != null) ? 1 : undefined,
                }]}>{props.title}</CustomizedText>,
                ...(() => {
                    if (isLoading){
                        return [<CustomActivityIndicator key={3} />]
                    } else if (props.rightSwitchInfo == null) {
                        return [
                            <CustomizedText key={4} numberOfLines={1} style={styles.subtitleText}>{props.rightSubtitleText ?? ''}</CustomizedText>,
                            <Image key={5} style={styles.chevronIcon} source={require('./arrow.png')} />
                        ]
                    } else {
                        return [<CustomSwitch
                            key={6}
                            value={props.rightSwitchInfo.isOnValue}
                            onValueChange={(val) => {
                                const returnVal = props.rightSwitchInfo?.onValueChange(val);
                                if (returnVal instanceof Promise){
                                    setIsLoading(true);
                                    returnVal.finally(() => {
                                        setIsLoading(false);
                                    });
                                }
                            }}
                        />]
                    }
                })()
            ]} />
        </BouncyButton>
    }
    return SettingsItemView;
})();

export default SettingsItemView;
