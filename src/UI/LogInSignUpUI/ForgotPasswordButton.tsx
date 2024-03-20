import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import CustomizedText from '../../helpers/Views/CustomizedText';
import { useNavigation } from '@react-navigation/native';
import { CustomColors } from '../../helpers/colors';
import { CustomFont } from '../../helpers/fonts/fonts';
import LayoutConstants from '../../LayoutConstants';
import { StackNavigationProp } from '@react-navigation/stack';
import { LogInSignUpUIParams } from './helpers';

interface ForgotPasswordButtonProps{
    onForgottenPasswordChanged?: (email: string, password: string) => void;
}

const ForgotPasswordButton = (() => {
    
    const styles = StyleSheet.create({
        forgotPasswordText: {
            color: CustomColors.themeGreen.stringValue,
            fontFamily: CustomFont.medium,
            fontSize: 16,
            marginLeft: LayoutConstants.forms.textFieldTitleInset,
        }
    });
    
    const ForgotPasswordButton = (props: ForgotPasswordButtonProps) => {
        const navigation = useNavigation<StackNavigationProp<LogInSignUpUIParams>>();
        return <TouchableOpacity onPress={() => {
            navigation.push('ForgotPassword', {onPasswordChanged: props.onForgottenPasswordChanged});
        }}>
            <CustomizedText style={styles.forgotPasswordText}>
                Forgot password?
            </CustomizedText>
        </TouchableOpacity>
    }
    return ForgotPasswordButton;
})();

export default ForgotPasswordButton;
