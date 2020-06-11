
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
import { Audio } from 'expo-av';


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

        const [totalSongSeconds, setTotalSongSeconds] = useState(0);
        const [scrubberSecondsValue, setScrubberSecondsValue] = useState(0);
        const [playPauseState, setPlayPauseState] = useState(PlayPauseButtonState.play);

        const scrubberPanGestureRef = useRef<PanGestureHandler>(null);
        const navigationScreenContext = useNavigationScreenContext();

        const soundObject = useRef(new Audio.Sound()).current;
        const userIsScrubbing = useRef(false);

        useEffect(() => {
            soundObject.loadAsync(require('./yummy.mp3')).then(status => {
                if (status.isLoaded === false){return;}
                setTotalSongSeconds((status.playableDurationMillis ?? 0) / 1000);
                soundObject.setProgressUpdateIntervalAsync(500);
            });
            soundObject.setOnPlaybackStatusUpdate(status => {
                if (status.isLoaded === false){return;}
                if (userIsScrubbing.current === false){
                    setScrubberSecondsValue(status.positionMillis / 1000);
                }
                if (status.didJustFinish){
                    soundObject.setPositionAsync(0);
                }
                setPlayPauseState(status.isPlaying ? PlayPauseButtonState.pause : PlayPauseButtonState.play);
            }); 
            return () => {soundObject.unloadAsync();}
        }, [soundObject]);


        useEffect(() => {
            navigationScreenContext.addGestureToWaitOn(scrubberPanGestureRef);
        }, [navigationScreenContext]);

        return <SpacerView style={styles.root} space={LayoutConstants.floatingCellStyles.padding}>
            <PlayPauseButton
                stateValue={playPauseState}
                onPress={pressedState => {
                    switch (pressedState) {
                        case PlayPauseButtonState.pause:
                            soundObject.pauseAsync();
                            setPlayPauseState(PlayPauseButtonState.play);
                            break;
                        case PlayPauseButtonState.play:
                            soundObject.playAsync();
                            setPlayPauseState(PlayPauseButtonState.pause);
                            break;
                    }
                }}
            />
            <View style={styles.scrubberHolder}>
                <Scrubber
                    panGestureRef={scrubberPanGestureRef}
                    value={scrubberSecondsValue}
                    totalDuration={totalSongSeconds}
                    onSlidingStarted={() => {
                        userIsScrubbing.current = true;
                    }}
                    onSlidingComplete={newValue => {
                        userIsScrubbing.current = true;
                        soundObject.setPositionAsync(newValue * 1000).then(() => {
                            userIsScrubbing.current = false;
                        });
                        setScrubberSecondsValue(newValue);
                    }}
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
                transform: [{ translateX: props.stateValue === PlayPauseButtonState.play ? circleSize * 0.05 : 0 }],
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






