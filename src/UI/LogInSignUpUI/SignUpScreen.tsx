
import React from 'react';
import { StyleSheet } from 'react-native';
import LogInSignUpScreenTemplate, { ExitOrBackButton } from './LogInSignUpScreenTemplate';
import Spacer from '../../helpers/Spacers/Spacer';
import { TextFieldView } from '../../helpers/Views/TextFieldView';
import { StackScreenProps } from '@react-navigation/stack';
import SpacerView from '../../helpers/Spacers/SpacerView';

const SignUpScreen = (() => {

    const styles = StyleSheet.create({
        root: {

        },
    });

    const SignUpScreen = (props: StackScreenProps<LogInSignUpUIParams, 'SignUp'>) => {
        return <LogInSignUpScreenTemplate
            title="Create An Account"
            subtitle="A user account allows you to place orders for food within the app."
            topRightButtonText="Log In"
            onTopRightButtonPressed={() => {
                const newRoute: keyof LogInSignUpUIParams = 'LogIn';
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
                <SpacerView space={15} style={{ flexDirection: 'row' }}>
                    <TextFieldView topTitleText="First Name" style={{ flex: 1 }} />
                    <TextFieldView topTitleText="Last Name" style={{ flex: 1 }} />
                </SpacerView>
                <TextFieldView topTitleText="Email" />
                <TextFieldView topTitleText="Phone Number" />
                <TextFieldView topTitleText="Password" />
            </Spacer>
            
        </LogInSignUpScreenTemplate>
    }
    return SignUpScreen;
})();

export default SignUpScreen;
