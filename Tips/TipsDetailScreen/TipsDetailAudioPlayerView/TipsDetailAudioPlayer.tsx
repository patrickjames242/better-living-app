
import { Audio, AVPlaybackStatus } from 'expo-av';
import { INTERRUPTION_MODE_IOS_DO_NOT_MIX, INTERRUPTION_MODE_ANDROID_DO_NOT_MIX } from 'expo-av/build/Audio';

export enum TipsDetailAudioPlayerPlayableState{
    notStartedLoadingYet,
    loading,
    notPlayingButReadyToPlay,
    playing,
    failed
}

export interface TipsDetailAudioPlayerState{
    playableState: TipsDetailAudioPlayerPlayableState,
    totalSongSeconds: number, 
    currentSongSecondsPosition: number,
}

export default function TipsDetailAudioPlayer(props: {
    onPlayerStateChange: (state: TipsDetailAudioPlayerState) => void,
}){
    const soundObject = new Audio.Sound();
    
    let latestState = {
        playableState: TipsDetailAudioPlayerPlayableState.notStartedLoadingYet,
        totalSongSeconds: 0,
        currentSongSecondsPosition: 0,
    };

    function updateState(transformer: (oldState: TipsDetailAudioPlayerState) => TipsDetailAudioPlayerState){
        latestState = transformer(latestState);
        props.onPlayerStateChange(latestState);
    }

    function updatePlayableState(newPlayableState: TipsDetailAudioPlayerPlayableState){
        updateState(oldState => ({
            ...oldState,
            playableState: newPlayableState,
        }))
    }

    function loadAudioFile(audioFileURL: string){

        function onPlaybackStatusUpdate(status: AVPlaybackStatus){
            if (status.isLoaded === false){return;}

            if (status.didJustFinish){
                soundObject.setPositionAsync(0);
            }

            const playableState: TipsDetailAudioPlayerPlayableState = (() => {
                if (status.isPlaying){
                    return TipsDetailAudioPlayerPlayableState.playing;
                } else {
                    const shouldBeLoading = status.isBuffering || isNaN(status.durationMillis ?? NaN) || ((status.durationMillis ?? NaN) <= 0);
                    return shouldBeLoading ? TipsDetailAudioPlayerPlayableState.loading : TipsDetailAudioPlayerPlayableState.notPlayingButReadyToPlay;
                }
            })();

            const newState: TipsDetailAudioPlayerState = {
                playableState,
                totalSongSeconds: (status.durationMillis ?? 0) / 1000,
                currentSongSecondsPosition: status.positionMillis / 1000,
            };
            updateState(() => newState);
        }

        Audio.setAudioModeAsync({
            playsInSilentModeIOS: true, 
            interruptionModeIOS: INTERRUPTION_MODE_IOS_DO_NOT_MIX, 
            interruptionModeAndroid: INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
        });

        updatePlayableState(TipsDetailAudioPlayerPlayableState.loading);

        soundObject.loadAsync({uri: audioFileURL}).then(status => {
            if (status.isLoaded === false){return;}
            soundObject.setProgressUpdateIntervalAsync(500);
            soundObject.setPositionAsync(0.1); // because without this, the durationMillis for the audio file doesn't load on the web 🙄
            soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        }).catch(() => {
            updatePlayableState(TipsDetailAudioPlayerPlayableState.failed);
        });

        return unloadAudioFile;
    }

    function unloadAudioFile(){
        soundObject.setOnPlaybackStatusUpdate(null);
        soundObject.unloadAsync();
    }

    function setCurrentSecondsPosition(newPosition: number){
        return soundObject.setPositionAsync(newPosition * 1000);
    }

    return {
        loadAudioFile,
        unloadAudioFile,
        play: () => soundObject.playAsync(),
        pause: () => soundObject.pauseAsync(),            
        setCurrentSecondsPosition,
    }
}