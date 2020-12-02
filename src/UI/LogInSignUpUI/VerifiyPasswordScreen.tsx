
import React, { useMemo } from 'react';
import { Formik } from '../../helpers/formik';
import * as yup from 'yup';
import LogInSignUpScreenTemplate, { ExitOrBackButton } from './LogInSignUpScreenTemplate';
import { FormikTextFieldView } from '../../helpers/Views/FormikTextFieldView';
import Space from '../../helpers/Spacers/Space';
import ForgotPasswordButton from './ForgotPasswordButton';
import { testPasswordValidity } from '../../api/authentication/authRequests';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, CompositeNavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { displayErrorMessage } from '../../helpers/Alerts';
import { LogInSignUpUIParams, VerifyPasswordPurpose } from './helpers';
import { RootNavigationViewParams } from '../RootNavigationView/helpers';
import { DefaultKeyboardConfigs } from '../../helpers/general';




interface VerifyPasswordValues{
    password: string;
}

const VerifyPasswordScreen = () => {

    const navigation = useNavigation<CompositeNavigationProp<StackNavigationProp<LogInSignUpUIParams, 'VerifyPassword'>, StackNavigationProp<RootNavigationViewParams>>>();

    const route = useRoute<RouteProp<LogInSignUpUIParams, 'VerifyPassword'>>();

    const initialValues: VerifyPasswordValues = useMemo(() => ({
        password: '',
    }), []);

    return <Formik
        initialValues={initialValues}
        validationSchema={yup.object({
            password: yup.string().required('Password is a required field.'),
        })}
        onSubmit={(values, {setSubmitting}) => {
            testPasswordValidity(values.password).finally(() => {
                setSubmitting(false);
            }).then(() => {
                navigation.navigate('MainInterface');
                route.params.onPasswordVerified(values.password);
            }).catch(error => {
                displayErrorMessage(error.message);
            });
        }}
    >{formik => {
        return <LogInSignUpScreenTemplate
            title="Enter Your Password"
            subtitle="In order to complete this action, you must first enter your current password."
            isContinueButtonLoading={formik.isSubmitting}
            onContinueButtonPress={formik.submitForm}
            isContinueButtonEnabled={formik.isValid && formik.dirty}
            topLeftButtonType={ExitOrBackButton.exit}
        >
            <FormikTextFieldView<VerifyPasswordValues> topTitleText="Password" textInputProps={{
                ...DefaultKeyboardConfigs.password,
                secureTextEntry: true,
            }} formikFieldName="password"/>
            <Space space={15}/>
            <ForgotPasswordButton onForgottenPasswordChanged={(_, password) => {
                switch (route.params.purpose){
                    case VerifyPasswordPurpose.forPasswordChange:break;
                    default: 
                        route.params.onPasswordVerified(password);
                        break;
                }
                navigation.navigate('MainInterface');
            }}/>
        </LogInSignUpScreenTemplate>
    }}</Formik>
}

export default VerifyPasswordScreen;
