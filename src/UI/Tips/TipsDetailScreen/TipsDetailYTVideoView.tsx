
import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import AspectRatioView from '../../../helpers/Views/AspectRatioView';
import LayoutConstants from '../../../LayoutConstants';

interface TipsDetailYTVideoViewProps{
    ytVideoID: string
}

const TipsDetailYTVideoView = (() => {

    const styles = StyleSheet.create({
        root: {
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            overflow: 'hidden',
            backgroundColor: 'white',
        },
    });

    const TipsDetailYTVideoView = (props: TipsDetailYTVideoViewProps) => {
        return <AspectRatioView style={styles.root} heightPercentageOfWidth={9 / 16}>
            {Platform.select({
                web: <iframe style={{width: '100%', height: '100%'}} src={`https://www.youtube.com/embed/${props.ytVideoID}`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>,
                default: <WebView
                    source={{ uri: `https://www.youtube.com/embed/${props.ytVideoID}` }}
                    javaScriptEnabled
                    domStorageEnabled
                />
            })}
        </AspectRatioView>
    }
    return TipsDetailYTVideoView;
})();

export default TipsDetailYTVideoView;




