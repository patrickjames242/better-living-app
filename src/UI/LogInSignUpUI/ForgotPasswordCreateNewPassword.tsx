import React, { useMemo } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import LogInSignUpScreenTemplate, {
  ExitOrBackButton,
} from './LogInSignUpScreenTemplate';
import { FormikTextFieldView } from '../../helpers/Views/FormikTextFieldView';
import { Formik } from '../../helpers/formik';
import * as yup from 'yup';
import {
  DefaultKeyboardConfigs,
  YUP_PASSWORD_VALIDATOR,
} from '../../helpers/general';
import { changePasswordWithVerificationCode } from '../../api/authentication/userRequests';
import { displayErrorMessage } from '../../helpers/Alerts';
import { LogInSignUpUIParams } from './helpers';

interface ForgotPasswordCreatePasswordValues {
  password: string;
}

const ForgotPasswordCreatePasswordScreen = (
  props: StackScreenProps<
    LogInSignUpUIParams,
    'ForgotPasswordCreateNewPassword'
  >,
) => {
  const initialValues = useMemo(
    () => ({
      password: '',
    }),
    [],
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yup.object({
        password: YUP_PASSWORD_VALIDATOR('password'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        changePasswordWithVerificationCode({
          verification_code: props.route.params.verificationCode,
          email: props.route.params.email,
          new_password: values.password,
        })
          .finally(() => {
            setSubmitting(false);
          })
          .then(() => {
            props.route.params.onPasswordChanged?.(
              props.route.params.email,
              values.password,
            );
          })
          .catch(error => {
            displayErrorMessage(error.message);
          });
      }}
    >
      {formik => {
        return (
          <LogInSignUpScreenTemplate
            title="Create A New Password"
            subtitle="Please enter the new password for your account."
            topLeftButtonType={ExitOrBackButton.back}
            onContinueButtonPress={formik.submitForm}
            isContinueButtonLoading={formik.isSubmitting}
            isContinueButtonEnabled={formik.isValid && formik.dirty}
          >
            <FormikTextFieldView<ForgotPasswordCreatePasswordValues>
              topTitleText="Password"
              formikFieldName="password"
              textInputProps={DefaultKeyboardConfigs.password}
            />
          </LogInSignUpScreenTemplate>
        );
      }}
    </Formik>
  );
};

export default ForgotPasswordCreatePasswordScreen;
