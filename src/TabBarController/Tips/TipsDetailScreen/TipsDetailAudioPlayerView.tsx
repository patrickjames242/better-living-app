
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import LayoutConstants from '../../../LayoutConstants';
import { Color, CustomColors } from '../../../helpers/colors';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import { CustomFont } from '../../../helpers/fonts/fonts';
import Scrubber from 'react-native-scrubber';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useNavigationScreenContext } from '../../../helpers/NavigationController/NavigationScreen';



const TipsDetailAudioPlayerView = (() => {

    const styles = StyleSheet.create({
        root: {
            padding: LayoutConstants.floatingCellStyles.padding,
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            backgroundColor: 'white',
            flexDirection: 'row',
            alignItems: 'center',
        },
        scrubberHolder: {
            flex: 1,
            marginLeft: 5,
            marginRight: 5,
            zIndex: -1,
        },
    });

    const TipsDetailAudioPlayerView = () => {

        const [scrubberValue, setScrubberValue] = useState(0);

        const scrubberPanGestureRef = useRef<PanGestureHandler>(null);
        const navigationScreenContext = useNavigationScreenContext();

        useEffect(() => {
            navigationScreenContext.addGestureToWaitOn(scrubberPanGestureRef);
        }, [navigationScreenContext]);

        return <SpacerView style={styles.root} space={LayoutConstants.floatingCellStyles.padding}>
            <PlayPauseButton 
                stateValue={PlayPauseButtonState.play}
            />
            <View style={styles.scrubberHolder}>
                <Scrubber
                    panGestureRef={scrubberPanGestureRef}
                    value={scrubberValue}
                    totalDuration={100}
                    onSlidingComplete={newValue => setScrubberValue(newValue)}
                    scrubbedColor={CustomColors.themeGreen.stringValue}
                    trackColor={Color.gray(0.6).stringValue}
                    displayedValueStyle={{ fontFamily: CustomFont.medium, color: CustomColors.offBlackSubtitle.stringValue }}
                />
            </View>
        </SpacerView>
    }
    return TipsDetailAudioPlayerView;
})();

export default TipsDetailAudioPlayerView;









enum PlayPauseButtonState {
    play,
    pause,
}

interface PlayButtonProps {
    onPress?: (statePressed: PlayPauseButtonState) => void;
    stateValue: PlayPauseButtonState;
}

const PlayPauseButton = (() => {

    const circleSize = 50;

    const styles = StyleSheet.create({
        root: {

        },
        contentView: {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Color.gray(0.93).stringValue,
        },
        image: {
            height: 20,
            width: 20,
            transform: [{ translateX: circleSize * 0.027 }]
        }
    });

    const PlayPauseButton = (props: PlayButtonProps) => {

        return <BouncyButton
            style={[styles.root]}
            contentViewProps={{ style: styles.contentView }}
            onPress={() => props.onPress?.(props.stateValue)}
        >
            <Image style={[styles.image, {
                transform: props.stateValue === PlayPauseButtonState.play ? [{ translateX: circleSize * 0.05 }] : undefined,
            }]} source={(() => {
                switch (props.stateValue) {
                    case PlayPauseButtonState.pause: return require('./pause.png')
                    case PlayPauseButtonState.play: return require('./play.png');
                }
            })()} />
        </BouncyButton>
    }

    return PlayPauseButton;
})();









// interface AudioScrubberProps{
//     // currentTimeInSeconds: number,
//     // totalTimeInSeconds: number,
// }

// const AudioScrubber = (() => {

//     const trackHeight = 4;
//     const trackBallSize = 12;  

//     const progress = '0%';

//     const styles = StyleSheet.create({
//         root: {
//             flex: 1,
//         },
//         fullTrack: {
//             height: trackHeight,
//             borderRadius: trackHeight / 2,
//             backgroundColor: Color.gray(0.93).stringValue,
//             flexDirection: 'row'
//         },
//         progressTrack: {
//             width: progress,
//             backgroundColor: CustomColors.themeGreen.stringValue,
//             borderRadius: trackHeight / 2,
//         },
//         trackBall: {
//             height: trackBallSize,
//             width: trackBallSize,
//             borderRadius: trackBallSize / 2,
//             backgroundColor: CustomColors.themeGreen.stringValue,
//             marginLeft: -(trackBallSize / 2),
//             marginTop: -(trackBallSize - trackHeight) / 2,
//         }
//     });

//     const AudioScrubber = (props: AudioScrubberProps) => {
//         return <View style={styles.root}>
//             <View style={styles.fullTrack}>
//                 <View style={styles.progressTrack}/>
//                 <View style={styles.trackBall}/>
//             </View>
//         </View>
//     }
//     return AudioScrubber;
// })();




