
import React, { useState } from 'react';
import {StyleSheet} from 'react-native';
import URLParser from 'url-parse';
import { TextFieldViewContainer, TextFieldTextInput } from '../../../../helpers/Views/TextFieldView';
import SpacerView from '../../../../helpers/Spacers/SpacerView';
import CreateOrEditTipEditButton, { CreateOrEditTipEditButton_EditButtonType } from '../CreateOrEditTipEditButton';
import { DefaultKeyboardConfigs } from '../../../../helpers/general';


export interface AddYoutubeVideoViewProps {
    onSubmitYoutubeId: (youtubeID: string) => void;
}

const AddYoutubeVideoView = (() => {

    const styles = StyleSheet.create({

        contentHolderView: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        textInput: {
            flex: 1,
        }

    });

    function extractVideoId(url: string): string | null {
        try {
            const parsedUrl = new URLParser(url, true); // because URL is not implemented in react native for some reason
            if (parsedUrl.hostname === "youtu.be"){
                const videoId = parsedUrl.pathname.split('/').filter(x => x.length >= 1)[0];
                return (typeof videoId === 'string') ? videoId : null;
            } else {
                return parsedUrl?.query?.v ?? null;
            }
        } catch {
            return null;
        }
    }

    const AddYoutubeVideoView = (props: AddYoutubeVideoViewProps) => {

        const [urlText, setUrlText] = useState('');

        const shouldAddButtonBeEnabled = typeof extractVideoId(urlText) === 'string';

        return <TextFieldViewContainer topTitleText="Add New YouTube Video">
            <SpacerView space={10} style={styles.contentHolderView}>
                <TextFieldTextInput
                    value={urlText}
                    onChangeText={setUrlText}
                    placeholder="e.g. https://www.youtube.com/watch?v=vMo5R5pLPBE"
                    style={styles.textInput}
                    {...DefaultKeyboardConfigs.website}
                />
                <CreateOrEditTipEditButton isEnabled={shouldAddButtonBeEnabled} buttonType={CreateOrEditTipEditButton_EditButtonType.add} onPress={() => {
                    const videoID = extractVideoId(urlText);
                    if (typeof videoID !== 'string') { return; }
                    setUrlText('');
                    props.onSubmitYoutubeId(videoID);
                }} />
            </SpacerView>
        </TextFieldViewContainer>
    }
    return AddYoutubeVideoView;
})();





export default AddYoutubeVideoView;