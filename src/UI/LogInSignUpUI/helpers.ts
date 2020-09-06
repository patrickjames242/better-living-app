
export type ForgottenPasswordChangedCallback = {onPasswordChanged?: (email: string, newPassword: string) => void};

export type LogInSignUpUIParams = {
    LogIn?: {email?: string, password?: string};
    SignUp: undefined;

    ForgotPassword?: ForgottenPasswordChangedCallback;
    ForgotPasswordVerificationCode: {email: string} & ForgottenPasswordChangedCallback,
    ForgotPasswordCreateNewPassword: {email: string, verificationCode: string} & ForgottenPasswordChangedCallback,
    
    VerifyPassword: {onPasswordVerified: (password: string) => void}
}

type Params<Key extends keyof LogInSignUpUIParams> = Key extends any ? {initialScreen: Key} & (LogInSignUpUIParams[Key] extends undefined ? {initialScreenParams?: undefined} : {initialScreenParams: LogInSignUpUIParams[Key]}) : never;


export type LogInSignUpUIContainerParams = Params<keyof LogInSignUpUIParams>;




