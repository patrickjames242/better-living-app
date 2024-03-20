export type ForgottenPasswordChangedCallback = {
  onPasswordChanged?: (email: string, newPassword: string) => void;
};

export enum VerifyPasswordPurpose {
  forPasswordChange,
  other,
}

export type LogInSignUpUIParams = {
  LogIn?: { email?: string; password?: string };
  SignUp: undefined;
  ForgotPassword?: ForgottenPasswordChangedCallback;
  ForgotPasswordVerificationCode: {
    email: string;
  } & ForgottenPasswordChangedCallback;
  ForgotPasswordCreateNewPassword: {
    email: string;
    verificationCode: string;
  } & ForgottenPasswordChangedCallback;
  VerifyPassword: {
    onPasswordVerified: (password: string) => void;
    purpose: VerifyPasswordPurpose;
  };
};

type Params<Key extends keyof LogInSignUpUIParams> = Key extends any
  ? undefined extends LogInSignUpUIParams[Key]
    ? { initialScreen: Key; initialScreenParams?: LogInSignUpUIParams[Key] }
    : { initialScreen: Key; initialScreenParams: LogInSignUpUIParams[Key] }
  : never;

export type LogInSignUpUIContainerParams = Params<keyof LogInSignUpUIParams>;
