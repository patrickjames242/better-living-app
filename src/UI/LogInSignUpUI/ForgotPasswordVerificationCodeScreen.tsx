
import React, { useMemo } from 'react';
import LogInSignUpScreenTemplate, { ExitOrBackButton } from './LogInSignUpScreenTemplate';
import { StackScreenProps } from '@react-navigation/stack';
import { Formik } from '../../helpers/formik';
import { testVerificationCodeValidity } from '../../api/authentication/verificationCodeRequests';
import * as yup from 'yup';
import { FormikTextFieldView } from '../../helpers/Views/FormikTextFieldView';
import { displayErrorMessage } from '../../helpers/Alerts';
import { LogInSignUpUIParams } from './helpers';

interface VerificationCodeFormValues{
    verificationCode: string;
}

const ForgotPasswordVerificationCodeScreen = (props: StackScreenProps<LogInSignUpUIParams, 'ForgotPasswordVerificationCode'>) => {
    const initialValues: VerificationCodeFormValues = useMemo(() => ({
        verificationCode: '',
    }), []);
    return <Formik
        initialValues={initialValues}
        validationSchema={yup.object({
            verificationCode: yup.string().trim().required('Verification code is required.'),
        })}
        onSubmit={(values, {setSubmitting}) => {
            const verificationCode = values.verificationCode.trim();
            testVerificationCodeValidity(props.route.params.email, verificationCode).finally(() => {
                setSubmitting(false);
            }).then(() => {
                props.navigation.push('ForgotPasswordCreateNewPassword', {email: props.route.params.email, verificationCode: verificationCode, onPasswordChanged: props.route.params.onPasswordChanged});
            }).catch(error => {
                displayErrorMessage(error.message);
            })
        }}
    >{formik => {
        return <LogInSignUpScreenTemplate
            title="Enter Verification Code"
            subtitle="A verification code has been sent to your email. Please enter this code below."
            topLeftButtonType={ExitOrBackButton.back}
            isContinueButtonLoading={formik.isSubmitting}
            onContinueButtonPress={formik.submitForm}
        >
            <FormikTextFieldView<VerificationCodeFormValues> topTitleText="Verification Code" formikFieldName="verificationCode"/>
        </LogInSignUpScreenTemplate>
    }}</Formik>
}


export default ForgotPasswordVerificationCodeScreen;