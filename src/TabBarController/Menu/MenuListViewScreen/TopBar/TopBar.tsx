

import React from 'react';
import { StyleSheet, Image} from 'react-native';
import LargeHeadingNavigationBar from '../../../../helpers/NavigationBar/LargeHeadingNavigationBar';



export default function TopBar() {

    return <LargeHeadingNavigationBar
        title={"Today's Menu"}
        rightAlignedView={
            <Image source={require('./profile-image.jpg')} style={topBarStyles.profileImage} />
        }
    />;
}

const topBarStyles = StyleSheet.create({
    profileImage: (() => {
        const size = 32.5;
        return {
            width: size, height: size,
            borderRadius: size / 2,
        };
    })(),
    

});

