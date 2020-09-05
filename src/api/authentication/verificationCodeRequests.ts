import { fetchFromAPI, HttpMethod } from "../api";





const basePath = 'auth/verification-code/';

enum VerificationCodeType{
    signUp,
    forgotMyPassword
}

function _sendVerificationCode(codeType: VerificationCodeType, email: string): Promise<null>{
    return fetchFromAPI({
        path: basePath + (() => {
            switch (codeType){
                case VerificationCodeType.signUp: return 'send-email-code';
                case VerificationCodeType.forgotMyPassword: return 'send-password-code';
            }
        })() + '/',
        method: HttpMethod.post,
        jsonBody: {
            email,
        }
    });
}


export function sendSignUpEmailVerificationCode(email: string){
    return _sendVerificationCode(VerificationCodeType.signUp, email);
}

export function sendForgotMyPasswordVerificationCode(email: string){
    return _sendVerificationCode(VerificationCodeType.forgotMyPassword, email);
}

export function testVerificationCodeValidity(email: string, verificationCode: string){
    return fetchFromAPI<null>({
        method: HttpMethod.get,
        path: basePath + `test-code-validity/?email=${email}&verification_code=${verificationCode}`,
    });
}
