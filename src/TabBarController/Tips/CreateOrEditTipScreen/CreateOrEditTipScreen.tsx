
import React, { useMemo, useState } from 'react';
import { StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/NavigationController/NavigationControllerNavigationBar';
import { Optional, mapOptional, displayErrorMessage } from '../../../helpers/general';
import store from '../../../redux/store';
import LayoutConstants from '../../../LayoutConstants';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import TextFieldView from '../../../helpers/Views/TextFieldView';
import LongTextAndIconButton from '../../../helpers/Buttons/LongTextAndIconButton';
import AssetImages from '../../../images/AssetImages';
import Space from '../../../helpers/Spacers/Space';
import { updateHealthTip, createNewHealthTip, HealthTipRequestObj } from '../../../api/healthTips/requests';
import { useNavigationScreenContext } from '../../../helpers/NavigationController/NavigationScreen';
import CreateOrEditTipConstants from './CreateOrEditTipConstants';
import CreateOrEditTipDescriptionView from './CreateOrEditTipDescriptionView';
import CreateOrEditTipYoutubeSection from './CreateOrEditTipYoutubeSection';
import { List } from 'immutable';


export interface CreateOrEditTipScreenProps {
    tipIdToEdit: Optional<number>
}



const CreateOrEditTipScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        scrollView: {
            flex: 1,
            zIndex: -1,
        },
        scrollViewContentContainer: {
            padding: LayoutConstants.pageSideInsets,
        },
        inputsHolder: {
            backgroundColor: 'white',
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            padding: LayoutConstants.floatingCellStyles.padding,
            maxWidth: LayoutConstants.floatingCellStyles.maxWidth,
            alignSelf: 'center',
            width: '100%',
        },
        saveChangesButton: {
            maxWidth: LayoutConstants.bottomScreenButtonWithGradient.maxWidth,
            width: '100%',
            alignSelf: 'center',
        }

    });

    function getInitialFieldValues(tipId: Optional<number>): {
        title: string,
        articleText: string,
        ytVideoIds: List<string>,
    } {
        const healthTip = mapOptional(tipId, x => store.getState().healthTips.get(x));
        if (healthTip == null) {
            return {
                title: '',
                articleText: '',
                ytVideoIds: List(),
            }
        } else {
            return {
                title: healthTip.title,
                articleText: healthTip.articleText ?? '',
                ytVideoIds: healthTip.youtubeVideoIDs,
            }
        }
    }

    const CreateOrEditTipScreen = (props: CreateOrEditTipScreenProps) => {

        const initialFieldValues = useMemo(() => {
            return getInitialFieldValues(props.tipIdToEdit);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const [isLoading, setIsLoading] = useState(false);

        const [title, setTitle] = useState(initialFieldValues.title);
        const [articleText, setArticleText] = useState(initialFieldValues.articleText);
        const [ytVideoIds, setYtVideoIds] = useState(initialFieldValues.ytVideoIds);

        const navigationBarTitle = (() => {
            if (props.tipIdToEdit == null) {
                return "Create New Health Tip";
            } else {
                return "Edit Health Tip";
            }
        })();

        const navigationScreenContext = useNavigationScreenContext();

        function saveChanges() {

            const requestObj: HealthTipRequestObj = { title: title, article_text: articleText,  yt_video_ids: ytVideoIds.toArray()};

            setIsLoading(true);
            ((props.tipIdToEdit == null) ?
                createNewHealthTip(requestObj) :
                updateHealthTip(props.tipIdToEdit, requestObj))
                .then(() => {
                    navigationScreenContext.dismiss();
                }).catch(error => {
                    displayErrorMessage(error.message);
                }).finally(() => {
                    setIsLoading(false);
                });
        }

        return <KeyboardAvoidingView behavior="padding" style={styles.root}>
            <NavigationControllerNavigationBar title={navigationBarTitle} />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
                <SpacerView style={styles.inputsHolder} space={15}>
                    <TextFieldView
                        value={title}
                        onValueChange={setTitle}
                        topTitleText="Title"
                        textInputProps={{ placeholder: CreateOrEditTipConstants.textFieldPlaceholder }}
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
                    <CreateOrEditTipDescriptionView
                        value={articleText}
                        onValueChange={setArticleText}
                    />
                </SpacerView>
                <Space space={15} />
                <LongTextAndIconButton
                    isLoading={isLoading}
                    style={styles.saveChangesButton}
                    text="Save Changes"
                    iconSource={AssetImages.saveIcon}
                    onPress={saveChanges}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    }
    return CreateOrEditTipScreen;
})();

export default CreateOrEditTipScreen;







