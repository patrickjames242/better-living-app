
import React, { useMemo } from 'react';
import LogInSignUpScreenTemplate, { ExitOrBackButton } from './LogInSignUpScreenTemplate';
import Spacer from '../../helpers/Spacers/Spacer';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from '../../helpers/formik';
import { FormikTextFieldView } from '../../helpers/Views/FormikTextFieldView';
import { logInUser } from '../../api/authentication/authRequests';
import * as yup from 'yup';
import { CompositeNavigationProp, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { displayErrorMessage } from '../../helpers/Alerts';
import ForgotPasswordButton from './ForgotPasswordButton';
import { LogInSignUpUIParams } from './helpers';
import { RootNavigationViewParams } from '../RootNavigationView/helpers';


interface LogInScreenValues{
    email: string;
    password: string;
}



const LogInScreen = () => {

    const navigation = useNavigation<CompositeNavigationProp<StackNavigationProp<LogInSignUpUIParams, 'LogIn'>, StackNavigationProp<RootNavigationViewParams, 'MainInterface'>>>();
    const route = useRoute<RouteProp<LogInSignUpUIParams, 'LogIn'>>()

    const initialValues: LogInScreenValues = useMemo(() => ({
        email: route.params?.email ?? '',
        password: route.params?.password ?? '',
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <ForgotPasswordButton onForgottenPasswordChanged={(email, password) => {
                    const route: keyof LogInSignUpUIParams = 'LogIn';
                    const params: LogInSignUpUIParams['LogIn'] = {email, password};
                    navigation.reset({
                        index: 0,
                        routes: [
                            {name: route, params}
                        ]
                    })
                }}/>
            </Spacer>
        </LogInSignUpScreenTemplate>
    }}</Formik>

}
    

export default LogInScreen;