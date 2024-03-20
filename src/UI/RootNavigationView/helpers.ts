import React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import { LogInSignUpUIContainerParams } from '../LogInSignUpUI/helpers';

export type RootNavigationViewParams = {
  MainInterface: undefined;
  LogInSignUpUI: LogInSignUpUIContainerParams;
};

export const navigationRef = React.createRef<NavigationContainerRef>();
