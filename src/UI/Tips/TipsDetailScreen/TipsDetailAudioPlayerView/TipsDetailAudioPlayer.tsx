
import { Audio, AVPlaybackStatus } from 'expo-av';
import { INTERRUPTION_MODE_IOS_DO_NOT_MIX, INTERRUPTION_MODE_ANDROID_DO_NOT_MIX } from 'expo-av/build/Audio';
import { Platform } from 'react-native';

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

        // in webkit browsers, the sound doesn't load properly until the play function is called, so we're calling it automatically and pausing it after it starts playing. This is set to true when the play function is first called and set to false when it starts playing
        let isAutoPlayingInitially = false;

        function onPlaybackStatusUpdate(status: AVPlaybackStatus){
            if (status.isLoaded === false){return;}


            // pausing song after our initial play if this is a safari browser, because of issue described above
            if (isAutoPlayingInitially && status.isPlaying){
                isAutoPlayingInitially = false;
                soundObject.pauseAsync()
                return;
            }

            if (status.didJustFinish){
                soundObject.setPositionAsync(0);
            }

            const playableState: TipsDetailAudioPlayerPlayableState = (() => {
                if (status.isPlaying){
                    return TipsDetailAudioPlayerPlayableState.playing;
                } else {
                    // return TipsDetailAudioPlayerPlayableState.notPlayingButReadyToPlay;
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

            // because on webkit browsers, the audio doesn't load properly unless you try to play it
            if (Platform.OS === 'web' && navigator.vendor.indexOf('Apple') !== -1){
                console.log('executed');
                isAutoPlayingInitially = true;
                soundObject.playAsync();
            }

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