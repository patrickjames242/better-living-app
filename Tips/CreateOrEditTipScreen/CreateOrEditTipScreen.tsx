
import React, { useMemo, useState } from 'react';
import { Optional, mapOptional } from '../../src/helpers/general';
import store from '../../src/redux/store';
import { TextFieldView, MultilineTextFieldView } from '../../src/helpers/Views/TextFieldView';
import { updateHealthTip, createNewHealthTip, HealthTipRequestObj } from '../../src/api/healthTips/requests';
import CreateOrEditTipYoutubeSection from './CreateOrEditTipYoutubeSection/CreateOrEditTipYoutubeSection';
import { List, Set } from 'immutable';
import CreateOrEditTipAudioFilesSection from './CreateOrEditTipAudioFilesSection/CreateOrEditTipAudioFilesSection';
import { HealthTipAudioFile } from '../../src/api/healthTips/HealthTip';
import { StackScreenProps, StackNavigationProp } from '@react-navigation/stack';
import { TipsNavStackParamList } from '../navigationHelpers';
import { useNavigation } from '@react-navigation/native';
import GenericEditingFormScreen from '../../src/helpers/Views/GenericEditingFormScreen';
import { DefaultLongButtonsProps } from '../../src/helpers/Buttons/LongTextAndIconButton';
import { displayErrorMessage } from '../../src/helpers/Alerts';



const CreateOrEditTipScreen = (() => {

    function getInitialFieldValues(tipId: Optional<number>): {
        title: string,
        articleText: string,
        ytVideoIds: List<string>,
        audioFiles: List<HealthTipAudioFile>,
    } {
        const healthTip = mapOptional(tipId, x => store.getState().healthTips.get(x));
        if (healthTip == null) {
            return {
                title: '',
                articleText: '',
                ytVideoIds: List(),
                audioFiles: List(),
            }
        } else {
            return {
                title: healthTip.title,
                articleText: healthTip.articleText ?? '',
                ytVideoIds: healthTip.youtubeVideoIDs,
                audioFiles: healthTip.audioFiles,
            }
        }
    }

    const CreateOrEditTipScreen = (props: StackScreenProps<TipsNavStackParamList, 'CreateOrEditTip'>) => {

        const initialFieldValues = useMemo(() => {
            return getInitialFieldValues(props.route.params.tipIdToEdit);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const [isLoading, setIsLoading] = useState(false);

        const [title, setTitle] = useState(initialFieldValues.title);
        const [articleText, setArticleText] = useState(initialFieldValues.articleText);
        const [ytVideoIds, setYtVideoIds] = useState(initialFieldValues.ytVideoIds);

        const [audioFilesToAdd, setAudioFilesToAdd] = useState(List<File>());
        const [audioFilesToDelete, setAudioFilesToDelete] = useState(Set<number>());

        const navigationBarTitle = (() => {
            if (props.route.params.tipIdToEdit == null) {
                return "Create New Health Tip";
            } else {
                return "Edit Health Tip";
            }
        })();

        const navigation = useNavigation<StackNavigationProp<TipsNavStackParamList, 'CreateOrEditTip'>>();

        function saveChanges() {

            const requestObj: HealthTipRequestObj = {
                title: title,
                article_text: articleText,
                yt_video_ids: ytVideoIds.toArray(),
                audioFilesToInsert: audioFilesToAdd,
                audioFilesToDelete: audioFilesToDelete.toList(),
            };

            setIsLoading(true);
            ((props.route.params.tipIdToEdit == null) ?
                createNewHealthTip(requestObj) :
                updateHealthTip(props.route.params.tipIdToEdit, requestObj))
                .then(() => {
                    navigation.goBack();
                }).catch(error => {
                    displayErrorMessage(error.message);
                }).finally(() => {
                    setIsLoading(false);
                });
        }

        return <GenericEditingFormScreen
            navBarTitle={navigationBarTitle}
            longButtons={[{
                ...DefaultLongButtonsProps.saveChanges,
                onPress: saveChanges,
                isLoading,
            }]}
        >
            <TextFieldView
                value={title}
                onChangeText={setTitle}
                topTitleText="Title"
            />
            <CreateOrEditTipYoutubeSection
                videoIds={ytVideoIds}
                onDeleteVideoId={videoId => {
                    setYtVideoIds(i => i.filter(x => x !== videoId));
                }}
                onAddVideoId={videoId => {
                    setYtVideoIds(x => x.filter(x => x !== videoId).push(videoId));
                }}
            />
            <CreateOrEditTipAudioFilesSection
                audioFiles={initialFieldValues.audioFiles}
                addedAudioFiles={audioFilesToAdd}
                deletedAudioFileIds={audioFilesToDelete}
                onUserWantsToAddFile={file => setAudioFilesToAdd(x => x.push(file))}
                onUserWantsToRemoveAddedFile={file => setAudioFilesToAdd(x => x.filter(y => y !== file))}
                onUserWantsToRemoveExistingFile={id => setAudioFilesToDelete(x => x.add(id))}
            />
            <MultilineTextFieldView 
                topTitleText="Description"
                value={articleText} 
                onChangeText={setArticleText}
            />
        </GenericEditingFormScreen>
    }
    return CreateOrEditTipScreen;
})();

export default CreateOrEditTipScreen;


