import React from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import LogInSignUpScreenTemplate from './LogInSignUpScreenTemplate';


interface LogInSignUpUIProps{
    initialScreen: InitialLogInSignUpScreen;
}

const Nav = createStackNavigator<LogInSignUpUIParams>();

const LogInSignUpUI = (props: StackScreenProps<RootNavigationViewParams, 'LogInSignUpUI'>) => {
    return <Nav.Navigator initialRouteName={props.route.params.initialScreen} screenOptions={{headerShown: false}}>
        <Nav.Screen name="LogIn" component={LogInSignUpScreenTemplate} />
    </Nav.Navigator>

}

export default LogInSignUpUI;