
import React from 'react';
import {StyleSheet, ActivityIndicator, Image} from 'react-native';
import { Color } from '../../../../helpers/colors';
import BouncyButton from '../../../../helpers/Buttons/BouncyButton';
import AssetImages from '../../../../images/AssetImages';


export enum PlayPauseButtonState {
    play,
    pause,
    loading,
    error,
    reload,
}

export interface PlayButtonProps {
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

        const shouldAllowPresses = [PlayPauseButtonState.play, PlayPauseButtonState.pause, PlayPauseButtonState.reload].includes(props.stateValue);

        return <BouncyButton
            pointerEvents={shouldAllowPresses ? undefined : 'none'}
            style={[styles.root]}
            contentViewProps={{ style: styles.contentView }}
            onPress={() => props.onPress?.(props.stateValue)}
        >
            {(() => {
                if (props.stateValue === PlayPauseButtonState.loading){
                    return <ActivityIndicator size={20} color={Color.gray(0.2).stringValue}/>
                } else {
                    return <Image style={[styles.image, {
                        transform: [{ translateX: props.stateValue === PlayPauseButtonState.play ? circleSize * 0.05 : 0 }],
                    }]} source={(() => {
                        switch (props.stateValue) {
                            case PlayPauseButtonState.pause: return AssetImages.pauseIcon;
                            case PlayPauseButtonState.play: return AssetImages.playIcon;
                            case PlayPauseButtonState.error: return AssetImages.warningIcon;
                            case PlayPauseButtonState.reload: return AssetImages.reloadIcon;
                        }
                    })()} />
                }
            })()}
            
        </BouncyButton>
    }

    return PlayPauseButton;
})();


export default PlayPauseButton;



