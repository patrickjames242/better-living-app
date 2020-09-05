



type LogInSignUpUIParams = {
    LogIn: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    ForgotPasswordVerificationCode: {email: string},
    ForgotPasswordCreateNewPassword: {email: string, verificationCode: string}
}

type InitialLogInSignUpScreen = keyof Pick<LogInSignUpUIParams, 'LogIn' | 'SignUp'>;


