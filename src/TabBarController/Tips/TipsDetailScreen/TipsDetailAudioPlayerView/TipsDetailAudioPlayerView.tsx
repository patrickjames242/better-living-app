
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import LayoutConstants from '../../../../LayoutConstants';
import { Color, CustomColors } from '../../../../helpers/colors';
import SpacerView from '../../../../helpers/Spacers/SpacerView';
import { CustomFont } from '../../../../helpers/fonts/fonts';
import Scrubber from 'react-native-scrubber';
import { PanGestureHandler } from 'react-native-gesture-handler';
import PlayPauseButton, { PlayPauseButtonState } from './TipsDetailAudioPlayerViewPlayPauseButton';
import TipsDetailAudioPlayer, { TipsDetailAudioPlayerPlayableState } from './TipsDetailAudioPlayer';
import AssetImages from '../../../../images/AssetImages';
import CustomizedText from '../../../../helpers/Views/CustomizedText';


interface TipsDetailAudioPlayerViewProps {
    audioFileUrl: string,
}

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
        errorView: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        errorIcon: {
            width: 20,
            height: 20,
            tintColor: CustomColors.redColor.stringValue,
        },
        errorText: {
            color: CustomColors.redColor.stringValue,
            fontSize: 12,
            flex: 1,
        }
    });

    const TipsDetailAudioPlayerView = (props: TipsDetailAudioPlayerViewProps) => {

        const [totalSongSeconds, setTotalSongSeconds] = useState(0);
        const [scrubberSecondsValue, setScrubberSecondsValue] = useState(0);
        const [playPauseState, setPlayPauseState] = useState(PlayPauseButtonState.loading);

        const scrubberPanGestureRef = useRef<PanGestureHandler>(null);

        const userIsScrubbing = useRef(false);

        const audioPlayer = useRef(TipsDetailAudioPlayer({
            onPlayerStateChange: state => {

                const playPauseButtonState = (() => {
                    const PlayableState = TipsDetailAudioPlayerPlayableState;
                    switch (state.playableState) {
                        case PlayableState.notStartedLoadingYet:
                        case PlayableState.loading:
                            return PlayPauseButtonState.loading;

                        case PlayableState.notPlayingButReadyToPlay:
                            return PlayPauseButtonState.play;

                        case PlayableState.playing:
                            return PlayPauseButtonState.pause;

                        case PlayableState.failed:
                            return PlayPauseButtonState.reload;
                    }
                })();

                setPlayPauseState(playPauseButtonState);
                setTotalSongSeconds(state.totalSongSeconds);

                if (userIsScrubbing.current === false) {
                    setScrubberSecondsValue(state.currentSongSecondsPosition);
                }
            }
        })).current;

        useEffect(() => {
            audioPlayer.loadAudioFile(props.audioFileUrl);
            return () => audioPlayer.unloadAudioFile()
        }, [audioPlayer, props.audioFileUrl]);

        // useEffect(() => {
        //     navigationScreenContext.addGestureToWaitOn(scrubberPanGestureRef);
        //     return () => navigationScreenContext.removeGestureToWaitOn(scrubberPanGestureRef);
        // }, [navigationScreenContext]);

        return <SpacerView style={styles.root} space={playPauseState === PlayPauseButtonState.reload ? 10 : LayoutConstants.floatingCellStyles.padding}>
            <PlayPauseButton
                stateValue={playPauseState}
                onPress={pressedState => {
                    switch (pressedState) {
                        case PlayPauseButtonState.pause:
                            audioPlayer.pause();
                            setPlayPauseState(PlayPauseButtonState.play);
                            break;
                        case PlayPauseButtonState.play:
                            audioPlayer.play();
                            setPlayPauseState(PlayPauseButtonState.pause);
                            break;
                        case PlayPauseButtonState.reload:
                            audioPlayer.loadAudioFile(props.audioFileUrl);
                            break;
                    }
                }}
            /> 
            <SpacerView style={styles.scrubberHolder} space={10}>
                {(() => {
                    if (playPauseState === PlayPauseButtonState.reload) {
                        return <SpacerView style={styles.errorView} space={10}>
                            <Image style={styles.errorIcon} source={AssetImages.warningIcon} />
                            <CustomizedText style={styles.errorText}>{`An error occured when trying to load this audio on your device. Try reloading or using the website version of this app.`}</CustomizedText>
                        </SpacerView>
                    } else {
                        return <Scrubber
                            panGestureRef={scrubberPanGestureRef}
                            value={scrubberSecondsValue}
                            totalDuration={totalSongSeconds}
                            onSlidingStarted={() => {
                                userIsScrubbing.current = true;
                            }}
                            onSlidingComplete={newValue => {
                                userIsScrubbing.current = true;
                                audioPlayer.setCurrentSecondsPosition(newValue).then(() => {
                                    userIsScrubbing.current = false;
                                });
                                setScrubberSecondsValue(newValue);
                            }}
                            scrubbedColor={CustomColors.themeGreen.stringValue}
                            trackColor={Color.gray(0.6).stringValue}
                            displayedValueStyle={{ fontFamily: CustomFont.medium, color: CustomColors.offBlackSubtitle.stringValue }}
                        />
                    }
                })()}
            </SpacerView>
        </SpacerView>
    }
    return TipsDetailAudioPlayerView;
})();

export default TipsDetailAudioPlayerView;






