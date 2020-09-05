
import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import IconButton from '../../helpers/Buttons/IconButton';
import AssetImages from '../../images/AssetImages';
import { useNavigation, CompositeNavigationProp, NavigationProp } from '@react-navigation/native';
import { CustomColors, Color } from '../../helpers/colors';
import CustomizedText from '../../helpers/Views/CustomizedText';
import { CustomFont } from '../../helpers/fonts/fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import LayoutConstants from '../../LayoutConstants';
import Spacer from '../../helpers/Spacers/Spacer';
import BottomScreenButtonWithGradient, { BottomScreenButtonWithGradientRef } from '../../helpers/Views/BottomScreenButtonWithGradient';
import CustomKeyboardAvoidingView from '../../helpers/Views/CustomKeyboardAvoidingView';
import { Optional } from '../../helpers/general';
import Space from '../../helpers/Spacers/Space';


export enum ExitOrBackButton {
    exit, back
}

export interface LogInSignUpScreenTemplateProps extends React.PropsWithChildren<{}> {
    title: string;
    subtitle: string;

    isContinueButtonLoading?: boolean;
    onContinueButtonPress?: () => void;

    topRightButtonText?: Optional<string>;
    onTopRightButtonPressed?: () => void;

    topLeftButtonType: ExitOrBackButton;

}

const LogInSignUpScreenTemplate = (() => {

    const screenPadding = 20;

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: 'white',
        },
        innerRootView: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: screenPadding,
            paddingTop: 20,
            paddingBottom: 10,
            alignItems: 'center',
        },
        headerRightText: {
            color: CustomColors.themeGreen.stringValue,
            fontFamily: CustomFont.medium,
            fontSize: 18,
        },
        scrollView: {

        },
        scrollViewContentView: {
            ...LayoutConstants.maxWidthListContentContainerStyles(600),
            padding: screenPadding,
        },
        titleText: {
            fontFamily: CustomFont.bold,
            fontSize: 25,
        },
        subtitleText: {
            fontSize: 15,
            lineHeight: 18,
        },
    });


    const LogInSignUpScreenTemplate = (props: LogInSignUpScreenTemplateProps) => {

        const navigation = useNavigation<CompositeNavigationProp<NavigationProp<LogInSignUpUIParams>, NavigationProp<RootNavigationViewParams>>>();

        const bottomScreenButtonRef = useRef<BottomScreenButtonWithGradientRef>(null);
        const [bottomButtonHolderHeight, setBottomButtonHolderHeight] = useState(0);

        return <SafeAreaView style={styles.root}>
            <CustomKeyboardAvoidingView style={styles.innerRootView}>
                <View style={{flex: 1}}>
                <View style={styles.header}>
                    <IconButton
                        iconSource={(() => {
                            switch (props.topLeftButtonType) {
                                case ExitOrBackButton.back: return AssetImages.backArrowIcon;
                                case ExitOrBackButton.exit: return AssetImages.xIcon;
                            }
                        })()}
                        iconSize={17}
                        onPress={() => {
                            switch (props.topLeftButtonType) {
                                case ExitOrBackButton.back:
                                    navigation.goBack();
                                    break;
                                case ExitOrBackButton.exit:
                                    navigation.navigate('MainInterface');
                                    break;
                            }
                        }}
                    />
                    {props.topRightButtonText &&
                        <TouchableOpacity onPress={props.onTopRightButtonPressed}>
                            <CustomizedText style={styles.headerRightText}>{
                                props.topRightButtonText
                            }</CustomizedText>
                        </TouchableOpacity>}
                </View>
                <ScrollView
                    scrollEventThrottle={50}
                    onScroll={x => bottomScreenButtonRef.current?.gradientHolder?.notifyThatScrollViewScrolled(x)}
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollViewContentView, {
                        paddingBottom: screenPadding + bottomButtonHolderHeight,
                    }]}
                >
                    <Spacer space={15}>
                        <CustomizedText style={styles.titleText}>{props.title}</CustomizedText>
                        <CustomizedText style={styles.subtitleText}>{props.subtitle}</CustomizedText>
                    </Spacer>
                    <Space space={30} />
                    {props.children}
                </ScrollView>
                <BottomScreenButtonWithGradient
                    ref={bottomScreenButtonRef}
                    gradientHolderProps={{
                        gradientColor: Color.gray(1),
                        onLayout: event => {
                            setBottomButtonHolderHeight(event.nativeEvent.layout.height);
                        }
                    }}
                    buttonProps={{
                        iconSource: AssetImages.continueIcon,
                        text: "Continue",
                        centerTitleText: true,
                        onPress: props.onContinueButtonPress,
                        isLoading: props.isContinueButtonLoading
                    }}
                />
                </View>
            </CustomKeyboardAvoidingView>
        </SafeAreaView>
    }
    return LogInSignUpScreenTemplate;
})();

export default LogInSignUpScreenTemplate;



