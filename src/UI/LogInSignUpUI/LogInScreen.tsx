import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import LogInSignUpScreenTemplate, {
  ExitOrBackButton,
} from './LogInSignUpScreenTemplate';
import Spacer from '../../helpers/Spacers/Spacer';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from '../../helpers/formik';
import { FormikTextFieldView } from '../../helpers/Views/FormikTextFieldView';
import { logInUser } from '../../api/authentication/authRequests';
import * as yup from 'yup';
import {
  CompositeNavigationProp,
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { displayErrorMessage } from '../../helpers/Alerts';
import ForgotPasswordButton from './ForgotPasswordButton';
import { LogInSignUpUIParams } from './helpers';
import { RootNavigationViewParams } from '../RootNavigationView/helpers';
import { DefaultKeyboardConfigs } from '../../helpers/general';
import { FormikConfig, FormikProps } from 'formik';

interface LogInScreenValues {
  email: string;
  password: string;
}

const LogInScreen = () => {
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<LogInSignUpUIParams, 'LogIn'>,
        StackNavigationProp<RootNavigationViewParams, 'MainInterface'>
      >
    >();
  const route = useRoute<RouteProp<LogInSignUpUIParams, 'LogIn'>>();

  const initialValues: LogInScreenValues = useMemo(
    () => ({
      email: '',
      password: '',
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [],
  );

  const yupSchema = yup.object({
    email: yup
      .string()
      .trim()
      .required('Email is a required field.')
      .email('Email must be a valid email.'),
    password: yup.string().trim().required('Password is a required field.'),
  });

  const formikRef = useRef<FormikProps<LogInScreenValues>>(null);

  useLayoutEffect(() => {
    if (route.params?.email || route.params?.password) {
      formikRef.current?.setValues({
        email: route.params.email ?? formikRef.current.values.email,
        password: route.params.password ?? formikRef.current.values.password,
      });
    }
  }, [route.params?.email, route.params?.password]);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={yupSchema}
      onSubmit={(values, { setSubmitting }) => {
        logInUser({
          email: values.email.trim(),
          password: values.password,
        })
          .finally(() => {
            setSubmitting(false);
          })
          .then(() => {
            navigation.navigate('MainInterface');
          })
          .catch(error => {
            displayErrorMessage(error.message);
          });
      }}
    >
      {formik => {
        return (
          <LogInSignUpScreenTemplate
            title="Log In"
            subtitle="A user account allows you to place orders for food within the app."
            topRightButtonText="Sign Up"
            onTopRightButtonPressed={() => {
              const newRoute: keyof LogInSignUpUIParams = 'SignUp';
              navigation.reset({
                index: 0,
                routes: [{ name: newRoute }],
              });
            }}
            isContinueButtonEnabled={formik.isValid && formik.dirty}
            isContinueButtonLoading={formik.isSubmitting}
            topLeftButtonType={ExitOrBackButton.exit}
            onContinueButtonPress={formik.submitForm}
          >
            <Spacer space={15}>
              <FormikTextFieldView<LogInScreenValues>
                topTitleText="Email"
                formikFieldName="email"
                textInputProps={DefaultKeyboardConfigs.email}
              />
              <FormikTextFieldView<LogInScreenValues>
                topTitleText="Password"
                textInputProps={{
                  ...DefaultKeyboardConfigs.password,
                  secureTextEntry: true,
                }}
                formikFieldName="password"
              />
              <ForgotPasswordButton
                onForgottenPasswordChanged={(email, password) => {
                  const route: keyof LogInSignUpUIParams = 'LogIn';
                  const params: LogInSignUpUIParams['LogIn'] = {
                    email,
                    password,
                  };
                  navigation.reset({
                    index: 0,
                    routes: [{ name: route, params }],
                  });
                }}
              />
            </Spacer>
          </LogInSignUpScreenTemplate>
        );
      }}
    </Formik>
  );
};

export default LogInScreen;
