import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabBarController from '../TabBarController/TabBarController';
import LogInSignUpUI from '../LogInSignUpUI/LogInSignUpUI';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef, RootNavigationViewParams } from './helpers';

const Nav = createStackNavigator<RootNavigationViewParams>();

const RootNavigationView = () => {
  return (
    <NavigationContainer ref={navigationRef} documentTitle={{ enabled: false }}>
      <Nav.Navigator
        mode="modal"
        initialRouteName="MainInterface"
        screenOptions={{
          gestureEnabled: false,
          headerShown: false,
          animationEnabled: true,
        }}
      >
        <Nav.Screen name="MainInterface" component={TabBarController} />
        <Nav.Screen name="LogInSignUpUI" component={LogInSignUpUI} />
      </Nav.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigationView;
