
import React, { useRef, useImperativeHandle, useCallback, useState, useEffect } from 'react';
import { StyleSheet, View, Animated, Easing, BackHandler } from 'react-native';
import { Color } from '../../helpers/colors';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import CustomizedText from '../../helpers/Views/CustomizedText';
import { CustomFont } from '../../helpers/fonts/fonts';
import Space from '../../helpers/Spacers/Space';
import LongTextAndIconButton from '../../helpers/Buttons/LongTextAndIconButton';
import AssetImages from '../../images/AssetImages';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootNavigationViewParams } from '../RootNavigationView/helpers';
import { batch } from 'react-redux';


export interface LogInPopUpRef {
    present: () => void;
}

export interface LogInPopUpProps {
    // onDismiss?: () => void;
}

const LogInPopUp = (() => {

    const popUpViewOverShootLength = 50;
    const popUpContainerPadding = 25;

    const styles = StyleSheet.create({
        root: {
            alignItems: 'center',
            justifyContent: 'flex-end',
            ...StyleSheet.absoluteFillObject,
            zIndex: 10,
            elevation: 10,
            overflow: 'hidden',
        },
        backgroundView: {
            backgroundColor: Color.gray(0.2).stringValue,
            ...StyleSheet.absoluteFillObject,
        },
        popUpContainer: {
            maxWidth: 600,
            width: '100%',
            backgroundColor: 'white',
            padding: popUpContainerPadding,
            marginBottom: -popUpViewOverShootLength,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            alignItems: 'center',
        },
        innerPopUpContainer: {
            maxWidth: 400,
            alignItems: 'center',
        },
        titleText: {
            fontSize: 19,
            fontFamily: CustomFont.bold,
        },
        subtitleText: {
            fontSize: 15.5,
            fontFamily: CustomFont.regular,
            textAlign: 'center',
        },
        longButtons: {
            alignSelf: 'stretch',
        },
    });

    

    const LogInPopUp: React.ForwardRefRenderFunction<LogInPopUpRef, LogInPopUpProps> = (props, ref) => {

        const animatedValue = useRef(new Animated.Value(0)).current;
        const safeArea = useSafeAreaInsets();

        const navigation = useNavigation<NavigationProp<RootNavigationViewParams, 'MainInterface'>>();

        const [showViews, setShowViews] = useState(false);

        const [isPresented, setIsPresentedState] = useState(false);

        const setPresented = useCallback((isPresented: boolean) => {
            batch(() => {
                setIsPresentedState(isPresented);
                setShowViews(true);
            });
            Animated.timing(animatedValue, {
                toValue: isPresented ? 1 : 0,
                duration: isPresented ? 400 : 300,
                easing: Easing.elastic(0.9),
                useNativeDriver: true,
            }).start(endResult => {
                endResult.finished && (isPresented === false) && setShowViews(false);
            });
        }, [animatedValue]);

        useEffect(() => {
            if (isPresented) {
                return BackHandler.addEventListener('hardwareBackPress', () => {
                    setPresented(false);
                    return true
                }).remove;
            }
        }, [isPresented, setPresented]);

        useImperativeHandle(ref, () => ({
            present: () => setPresented(true),
        }), [setPresented]);

        if (showViews === false) {
            return <></>
        } else {
            return <View style={styles.root}>
                <TapGestureHandler
                    maxDist={1}
                    onHandlerStateChange={x => {
                        x.nativeEvent.state === State.ACTIVE && setPresented(false);
                    }}
                >
                    <Animated.View style={[styles.backgroundView, {
                        opacity: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.5],
                        }),
                    }]} />
                </TapGestureHandler>
                <Animated.View style={[styles.popUpContainer, {
                    opacity: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                    }),
                    transform: [{
                        translateY: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [200, 0],
                        })
                    }],
                    paddingBottom: popUpContainerPadding + popUpViewOverShootLength + safeArea.bottom,
                }]}>
                    <View style={styles.innerPopUpContainer}>
                        <CustomizedText style={styles.titleText}>
                            Log in to continue
                    </CustomizedText>
                        <Space space={20} />
                        <CustomizedText style={styles.subtitleText}>
                            In order to access this feature, you need to create an account or log in.
                    </CustomizedText>
                        <Space space={20} />
                        <LongTextAndIconButton
                            centerTitleText
                            style={styles.longButtons}
                            iconSource={AssetImages.logInIcon}
                            text="Log In"
                            onPress={() => {
                                navigation.navigate('LogInSignUpUI', { initialScreen: 'LogIn' });
                                setPresented(false);
                            }}
                        />
                        <Space space={10} />
                        <LongTextAndIconButton
                            centerTitleText
                            style={styles.longButtons}
                            iconSource={AssetImages.createNewAccountIcon}
                            text="Create An Account"
                            onPress={() => {
                                navigation.navigate('LogInSignUpUI', { initialScreen: 'SignUp' });
                                setPresented(false);
                            }}
                        />
                    </View>
                </Animated.View>
            </View>
        }
    }
    return React.forwardRef(LogInPopUp);
})();

export default LogInPopUp;


