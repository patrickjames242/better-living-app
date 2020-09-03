
import React from 'react';
import { StyleSheet } from 'react-native';
import LogInSignUpScreenTemplate, { ExitOrBackButton } from './LogInSignUpScreenTemplate';
import Spacer from '../../helpers/Spacers/Spacer';
import SpacerView from '../../helpers/Spacers/SpacerView';
import { TextFieldView } from '../../helpers/Views/TextFieldView';
import { StackScreenProps } from '@react-navigation/stack';


const LogInScreen = (() => {

    const styles = StyleSheet.create({
        root: {

        },
    });

    const LogInScreen = (props: StackScreenProps<LogInSignUpUIParams, 'LogIn'>) => {
        return <LogInSignUpScreenTemplate
            title="Log In"
            subtitle="A user account allows you to place orders for food within the app."
            topRightButtonText="Sign Up"
            onTopRightButtonPressed={() => {
                const newRoute: keyof LogInSignUpUIParams = 'SignUp';
                props.navigation.reset({
                    index: 0,
                    routes: [
                        {name: newRoute},
                    ]
                });
            }}
            topLeftButtonType={ExitOrBackButton.exit}
        >
            <Spacer space={15}>
                <TextFieldView topTitleText="Email" />
                <TextFieldView topTitleText="Password" textInputProps={{secureTextEntry: true}}/>
            </Spacer>
        </LogInSignUpScreenTemplate>
    }
    return LogInScreen;
})();

export default LogInScreen;
