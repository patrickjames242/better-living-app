
import React, { useState } from 'react';
import {StyleSheet} from 'react-native';
import * as QueryString from 'query-string';
import URLParser from 'url-parse';
import { TextFieldViewContainer, TextFieldTextInput } from '../../../../helpers/Views/TextFieldView';
import SpacerView from '../../../../helpers/Spacers/SpacerView';
import CreateOrEditTipEditButton, { CreateOrEditTipEditButton_EditButtonType } from '../CreateOrEditTipEditButton';


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
            const queryString = URLParser(url)?.query;
            if (typeof queryString !== 'string') { return null; }
            const videoId = QueryString.parse(queryString)?.v;
            if (typeof videoId !== 'string' || videoId.trim().length < 1) { return null; }
            return videoId;
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
                    onValueChange={setUrlText}
                    textInputProps={{ placeholder: 'e.g. https://www.youtube.com/watch?v=vMo5R5pLPBE', style: styles.textInput }}
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