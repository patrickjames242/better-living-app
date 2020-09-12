
import React, { useMemo } from 'react';
import LogInSignUpScreenTemplate, { ExitOrBackButton } from './LogInSignUpScreenTemplate';
import Spacer from '../../helpers/Spacers/Spacer';
import SpacerView from '../../helpers/Spacers/SpacerView';
import { Formik } from '../../helpers/formik';
import * as yup from 'yup';
import { YUP_PASSWORD_VALIDATOR } from '../../helpers/general';
import { SignUpInfo, signUpUser } from '../../api/authentication/authRequests';
import { useNavigation, CompositeNavigationProp, NavigationProp } from '@react-navigation/native';
import { FormikTextFieldView } from '../../helpers/Views/FormikTextFieldView';
import { StyleSheet } from 'react-native';
import { displayErrorMessage } from '../../helpers/Alerts';
import { LogInSignUpUIParams } from './helpers';
import { RootNavigationViewParams } from '../RootNavigationView/helpers';

interface SignUpScreenValues{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
}

const styles = StyleSheet.create({
    nameContainer: {
        flexDirection: 'row',
    },
    nameContainerChild: {
        flex: 1,
    }
});

const SignUpScreen = () => {

    const initialValues: SignUpScreenValues = useMemo(() => ({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
    }), []);

    const navigation = useNavigation<CompositeNavigationProp<NavigationProp<LogInSignUpUIParams, 'SignUp'>, NavigationProp<RootNavigationViewParams, 'MainInterface'>>>();

    return <Formik
        initialValues={initialValues}
        validationSchema={yup.object({
            firstName: yup.string().trim().required('First name is a required field.'),
            lastName: yup.string().trim().required('Last name is a required field.'),
            email: yup.string().trim().required('Email is a required field.').email('Email must be a valid email.'),
            phoneNumber: yup.string().trim().required('Phone number is a required field.'),
            password: YUP_PASSWORD_VALIDATOR('password'),
        })}
        onSubmit={(values, {setSubmitting}) => {
            const requestObj: SignUpInfo = {
                first_name: values.firstName.trim(),
                last_name: values.lastName.trim(),
                phone_number: values.phoneNumber.trim(),
                email: values.email.trim(),
                password: values.password,
            }
            signUpUser(requestObj).finally(() => {
                setSubmitting(false);
            }).then(() => {
                navigation.navigate('MainInterface');
            }).catch(error => {
                displayErrorMessage(error.message);
            });
        }}
    >{formik => {
        return <LogInSignUpScreenTemplate
            title="Create An Account"
            subtitle="A user account allows you to place orders for food within the app."
            topRightButtonText="Log In"
            onTopRightButtonPressed={() => {
                const newRoute: keyof LogInSignUpUIParams = 'LogIn';
                navigation.reset({
                    index: 0,
                    routes: [
                        { name: newRoute },
                    ]
                });
            }}
            onContinueButtonPress={formik.submitForm}
            isContinueButtonLoading={formik.isSubmitting}
            topLeftButtonType={ExitOrBackButton.exit}
        >
            <Spacer space={15}>
                <SpacerView space={15} style={styles.nameContainer}>
                    <FormikTextFieldView<SignUpScreenValues> topTitleText="First Name" style={styles.nameContainerChild} formikFieldName="firstName" />
                    <FormikTextFieldView<SignUpScreenValues> topTitleText="Last Name" style={styles.nameContainerChild} formikFieldName="lastName"/>
                </SpacerView>
                <FormikTextFieldView<SignUpScreenValues> topTitleText="Email" formikFieldName="email" />
                <FormikTextFieldView<SignUpScreenValues> topTitleText="Phone Number" formikFieldName="phoneNumber"/>
                <FormikTextFieldView<SignUpScreenValues> topTitleText="Password" formikFieldName="password"/>
            </Spacer>
        </LogInSignUpScreenTemplate>
    }}</Formik>
}

export default SignUpScreen;
