import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import AspectRatioView from '../../../helpers/AspectRatioView';
import LayoutConstants from '../../../LayoutConstants';



const TipsDetailYTVideoView = (() => {

    const styles = StyleSheet.create({
        root: {
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            overflow: 'hidden',
            backgroundColor: 'white',
        },
    });

    const ytVideoID = "RX6YeYT3ed8";

    const TipsDetailYTVideoView = () => {
        return <AspectRatioView style={styles.root} heightPercentageOfWidth={9 / 16}>
            {Platform.select({
                web: <iframe style={{width: '100%', height: '100%'}} src={`https://www.youtube.com/embed/${ytVideoID}`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>,
                default: <WebView
                    source={{ uri: `https://www.youtube.com/embed/${ytVideoID}` }}
                    javaScriptEnabled
                    domStorageEnabled
                />
            })}
        </AspectRatioView>
    }
    return TipsDetailYTVideoView;
})();

export default TipsDetailYTVideoView;
