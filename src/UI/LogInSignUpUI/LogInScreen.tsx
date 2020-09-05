
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import LogInSignUpScreenTemplate, { ExitOrBackButton } from './LogInSignUpScreenTemplate';
import Spacer from '../../helpers/Spacers/Spacer';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomizedText from '../../helpers/Views/CustomizedText';
import { CustomColors } from '../../helpers/colors';
import { CustomFont } from '../../helpers/fonts/fonts';
import LayoutConstants from '../../LayoutConstants';
import { Formik } from '../../helpers/formik';
import { FormikTextFieldView } from '../../helpers/Views/FormikTextFieldView';
import { logInUser } from '../../api/authentication/authRequests';
import { displayErrorMessage } from '../../helpers/general';
import * as yup from 'yup';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';


interface LogInScreenValues{
    email: string;
    password: string;
}


const LogInScreen = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        forgotPasswordText: {
            color: CustomColors.themeGreen.stringValue,
            fontFamily: CustomFont.medium,
            fontSize: 16,
            marginLeft: LayoutConstants.forms.textFieldTitleInset,
        }
    });

    const LogInScreen = () => {

        const navigation = useNavigation<CompositeNavigationProp<StackNavigationProp<LogInSignUpUIParams, 'LogIn'>, StackNavigationProp<RootNavigationViewParams, 'MainInterface'>>>();

        const initialValues: LogInScreenValues = useMemo(() => ({
            email: '',
            password: '',
        }), []);

        return <Formik
            initialValues={initialValues}
            validationSchema={yup.object({
                email: yup.string().trim().required('Email is a required field.').email('Email must be a valid email.'),
                password: yup.string().trim().required('Password is a required field.'),
            })}
            onSubmit={(values, {setSubmitting}) => {
                logInUser({
                    email: values.email.trim(),
                    password: values.password,
                }).finally(() => {
                    setSubmitting(false);
                }).then(() => {
                    navigation.navigate('MainInterface');
                }).catch(error => {
                    displayErrorMessage(error.message);
                });
            }}
        >{formik => {
            return <LogInSignUpScreenTemplate
                title="Log In"
                subtitle="A user account allows you to place orders for food within the app."
                topRightButtonText="Sign Up"
                onTopRightButtonPressed={() => {
                    const newRoute: keyof LogInSignUpUIParams = 'SignUp';
                    navigation.reset({
                        index: 0,
                        routes: [
                            { name: newRoute },
                        ]
                    });
                }}
                isContinueButtonLoading={formik.isSubmitting}
                topLeftButtonType={ExitOrBackButton.exit}
                onContinueButtonPress={formik.submitForm}
            >
                <Spacer space={15}>
                    <FormikTextFieldView<LogInScreenValues> topTitleText="Email" formikFieldName="email"/>
                    <FormikTextFieldView<LogInScreenValues> topTitleText="Password" textInputProps={{ secureTextEntry: true }} formikFieldName="password"/>
                    <TouchableOpacity onPress={() => {
                        navigation.push('ForgotPassword');
                    }}>
                        <CustomizedText style={styles.forgotPasswordText}>
                            Forgot password?
                        </CustomizedText>
                    </TouchableOpacity>
                </Spacer>
            </LogInSignUpScreenTemplate>
        }}</Formik>


    }
    return LogInScreen;
})();

export default LogInScreen;
