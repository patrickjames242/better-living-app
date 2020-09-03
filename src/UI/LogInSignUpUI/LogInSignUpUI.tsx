import React from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import LogInScreen from './LogInScreen';
import SignUpScreen from './SignUpScreen';


const Nav = createStackNavigator<LogInSignUpUIParams>();

const LogInSignUpUI = (props: StackScreenProps<RootNavigationViewParams, 'LogInSignUpUI'>) => {
    return <Nav.Navigator initialRouteName={props.route.params.initialScreen} screenOptions={{headerShown: false}}>
        <Nav.Screen name="LogIn" component={LogInScreen} />
        <Nav.Screen name="SignUp" component={SignUpScreen} />
    </Nav.Navigator>

}

export default LogInSignUpUI;