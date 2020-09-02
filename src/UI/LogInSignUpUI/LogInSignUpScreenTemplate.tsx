import React from 'react';
import {StyleSheet, View, Button, TouchableOpacity, ScrollView} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import IconButton from '../../helpers/Buttons/IconButton';
import AssetImages from '../../images/AssetImages';
import { useNavigation, CompositeNavigationProp, NavigationProp } from '@react-navigation/native';
import { CustomColors } from '../../helpers/colors';
import CustomizedText from '../../helpers/Views/CustomizedText';
import { CustomFont } from '../../helpers/fonts/fonts';
import { useSafeArea } from 'react-native-safe-area-context';
import LayoutConstants from '../../LayoutConstants';
import { TextFieldView } from '../../helpers/Views/TextFieldView';
import Spacer from '../../helpers/Spacers/Spacer';
import Space from '../../helpers/Spacers/Space';

export interface LogInSignUpScreenTemplateProps{
    
}

const LogInSignUpScreenTemplate = (() => {

    const screenPadding = 20;
    
    const styles = StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: 'white',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: screenPadding,
            paddingBottom: 10,
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

        },
    });

    
    const LogInSignUpScreenTemplate = () => {

        const navigation = useNavigation<CompositeNavigationProp<NavigationProp<LogInSignUpUIParams>, NavigationProp<RootNavigationViewParams>>>();

        const safeArea = useSafeArea();

        return <View style={styles.root}>
            <View style={[styles.header, {
                
                paddingTop: safeArea.top + screenPadding,
            }]}>
                <IconButton iconSource={AssetImages.xIcon} iconSize={17} onPress={() => {
                    navigation.navigate('MainInterface');
                }}/>
                <TouchableOpacity onPress={() => {}}>
                    <CustomizedText style={styles.headerRightText}>Log In</CustomizedText>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentView}>
                <Spacer space={15}>
                    <CustomizedText style={styles.titleText}>Create An Account</CustomizedText>
                    <CustomizedText style={styles.subtitleText}>By continuing, you agree to our User Agreement and Privacy Policy.</CustomizedText>
                </Spacer>
                <Space space={20}/>
                <Spacer space={15}>
                    <TextFieldView placeholder="Email..."/>
                    <TextFieldView placeholder="Password..."/>
                </Spacer>
            </ScrollView>
        </View>
    }
    return LogInSignUpScreenTemplate;
})();

export default LogInSignUpScreenTemplate;




