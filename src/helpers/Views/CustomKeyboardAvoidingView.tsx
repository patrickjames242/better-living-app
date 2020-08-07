



import React, { PropsWithChildren } from 'react';
import {View, ViewProps, Platform, KeyboardAvoidingView} from 'react-native';

export interface CustomKeyboardAvoidingViewProps extends PropsWithChildren<ViewProps>{
    
}

const CustomKeyboardAvoidingView = (() => {
    
    const CustomKeyboardAvoidingView = (props: CustomKeyboardAvoidingViewProps) => {
        return Platform.select({
            ios: <KeyboardAvoidingView behavior='padding' {...props}/>,
            default: <View {...props}/>
        });
    }
    return CustomKeyboardAvoidingView;
})();

export default CustomKeyboardAvoidingView;


