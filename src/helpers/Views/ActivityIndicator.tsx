import React from 'react';
import {ActivityIndicator, ActivityIndicatorProps} from 'react-native';
import { Color } from '../colors';


    
const CustomActivityIndicator = (props: ActivityIndicatorProps) => {
    const color = props.color ?? Color.gray(0.4).stringValue;
    return <ActivityIndicator {...props} color={color}/>
}
export default CustomActivityIndicator;