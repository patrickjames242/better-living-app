import React from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import LogInScreen from './LogInScreen';
import SignUpScreen from './SignUpScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import ForgotPasswordVerificationCodeScreen from './ForgotPasswordVerificationCodeScreen';
import ForgotPasswordCreatePasswordScreen from './ForgotPasswordCreateNewPassword';
import VerifyPasswordScreen from './VerifiyPasswordScreen';
import { LogInSignUpUIParams } from './helpers';
import { RootNavigationViewParams } from '../RootNavigationView/helpers';

const Nav = createStackNavigator<LogInSignUpUIParams>();

const LogInSignUpUI = (
  props: StackScreenProps<RootNavigationViewParams, 'LogInSignUpUI'>,
) => {
  const getInitialParams = <Key extends keyof LogInSignUpUIParams>(
    routeName: Key,
  ) => {
    if (props.route.params.initialScreen === routeName) {
      return props.route.params.initialScreenParams as LogInSignUpUIParams[Key];
    }
  };

  return (
    <Nav.Navigator
      initialRouteName={props.route.params?.initialScreen}
      screenOptions={{ headerShown: false, animationEnabled: true }}
    >
      <Nav.Screen
        name="LogIn"
        component={LogInScreen}
        initialParams={getInitialParams('LogIn')}
      />
      <Nav.Screen
        name="SignUp"
        component={SignUpScreen}
        initialParams={getInitialParams('SignUp')}
      />
      <Nav.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        initialParams={getInitialParams('ForgotPassword')}
      />
      <Nav.Screen
        name="ForgotPasswordVerificationCode"
        component={ForgotPasswordVerificationCodeScreen}
        initialParams={getInitialParams('ForgotPasswordVerificationCode')}
      />
      <Nav.Screen
        name="ForgotPasswordCreateNewPassword"
        component={ForgotPasswordCreatePasswordScreen}
        initialParams={getInitialParams('ForgotPasswordCreateNewPassword')}
      />
      <Nav.Screen
        name="VerifyPassword"
        component={VerifyPasswordScreen}
        initialParams={getInitialParams('VerifyPassword')}
      />
    </Nav.Navigator>
  );
};

export default LogInSignUpUI;
