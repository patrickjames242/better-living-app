
import React, { useMemo } from 'react';
import LogInSignUpScreenTemplate, { ExitOrBackButton } from './LogInSignUpScreenTemplate';
import { StackScreenProps } from '@react-navigation/stack';
import { Formik } from '../../helpers/formik';
import * as yup from 'yup';
import { FormikTextFieldView } from '../../helpers/Views/FormikTextFieldView';
import { sendForgotMyPasswordVerificationCode } from '../../api/authentication/verificationCodeRequests';
import { displayErrorMessage } from '../../helpers/Alerts';
import { LogInSignUpUIParams } from './helpers';

interface ForgotPasswordFormValues {
    email: string;
}

const ForgotPasswordScreen = (props: StackScreenProps<LogInSignUpUIParams, 'ForgotPassword'>) => {

    const initialValues: ForgotPasswordFormValues = useMemo(() => ({
        email: '',
    }), []);

    return <Formik
        initialValues={initialValues}
        validationSchema={yup.object({
            email: yup.string().trim().required('Email is a required field.').email('Email must be a valid email.'),
        })}
        onSubmit={(values, { setSubmitting }) => {
            const email = values.email.trim();
            sendForgotMyPasswordVerificationCode(email).finally(() => {
                setSubmitting(false);
            }).then(() => {
                props.navigation.push('ForgotPasswordVerificationCode', { email: email, onPasswordChanged: props.route.params?.onPasswordChanged });
            }).catch((error) => {
                displayErrorMessage(error.message)
            });
        }}
    >{formik => {
        return <LogInSignUpScreenTemplate
            title="Forgot Password"
            subtitle="Please enter your email address below and a verification code will be sent to it."
            topLeftButtonType={ExitOrBackButton.back}
            onContinueButtonPress={formik.submitForm}
            isContinueButtonLoading={formik.isSubmitting}
        >
            <FormikTextFieldView<ForgotPasswordFormValues> topTitleText="Email" formikFieldName="email" />
        </LogInSignUpScreenTemplate>
    }}</Formik>
}

export default ForgotPasswordScreen;
