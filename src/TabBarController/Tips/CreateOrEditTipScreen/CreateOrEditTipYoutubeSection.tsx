
import React, { useState, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { TextFieldViewContainer, TextFieldViewConstants, TextFieldTextInput } from '../../../helpers/Views/TextFieldView';
import { List } from 'immutable';
import { Color, CustomColors } from '../../../helpers/colors';
import AspectRatioView from '../../../helpers/Views/AspectRatioView';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { YoutubeVideo, fetchYoutubeVideo } from '../../../api/youtube';
import { Optional } from '../../../helpers/general';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import AssetImages from '../../../images/AssetImages';
import * as QueryString from 'query-string';
import URLParser from 'url-parse';




export interface CreateOrEditTipYoutubeSectionProps {
    videoIds: List<string>;
    onDeleteVideoId: (id: string) => void;
    onAddVideoId: (id: string) => void;
}

const CreateOrEditTipYoutubeSection = (() => {

    const styles = StyleSheet.create({
        contentHolderView: {

            // height: 100,
        },
    });

    const CreateOrEditTipYoutubeSection = (props: CreateOrEditTipYoutubeSectionProps) => {
        return <TextFieldViewContainer topTitleText={props.videoIds.size >= 1 ? "YouTube Videos" : undefined}>
            {/* eslint-disable-next-line react/no-children-prop */}
            <SpacerView style={styles.contentHolderView} space={15} children={[
                ...(props.videoIds.map(x => {
                    return <YoutubeVideoView key={x} videoId={x} onDeleteButtonPressed={() => {
                        props.onDeleteVideoId(x);
                    }} />
                }).toArray()),
                <AddYoutubeVideoView key="add-new-video-view" onSubmitYoutubeId={props.onAddVideoId} />,
            ]} />
        </TextFieldViewContainer>
    }
    return CreateOrEditTipYoutubeSection;
})();

export default CreateOrEditTipYoutubeSection;





interface YoutubeVideoViewProps {
    videoId: string;
    onDeleteButtonPressed: () => void;
}

const YoutubeVideoView = (() => {

    const styles = StyleSheet.create({
        root: {
            flexDirection: 'row',
            borderRadius: TextFieldViewConstants.borderRadius,
            backgroundColor: Color.gray(0.96).stringValue,
            overflow: 'hidden',
            padding: 8,
            alignItems: 'center',
        },
        imageHolder: {
            width: 80,
            backgroundColor: 'white',
            borderRadius: 7,
            overflow: 'hidden',
        },
        innerImageHolder: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        image: {
            width: '100%',
            height: '100%',
        },
        errorIcon: {
            width: 25,
            height: 25,
            tintColor: CustomColors.redColor.stringValue,
        },
        textHolder: {
            flex: 1,
            // backgroundColor: 'red',
        },
        titleView: {
            // width: 0,
            fontSize: 15,
            fontFamily: CustomFont.medium,
            // flex: 1,
        },
        errorText: {
            color: CustomColors.redColor.stringValue,
            fontFamily: CustomFont.medium,
            fontSize: 15,
        },
        
    });

    enum FetchErrorType{
        idDoesNotExist,
        requestFailed,
    }

    const YoutubeVideoView = (props: YoutubeVideoViewProps) => {

        const [videoInfo, setVideoInfo] = useState<Optional<YoutubeVideo>>(null);
        const [fetchError, setFetchError] = useState<Optional<FetchErrorType>>(null);

        useEffect(() => {
            fetchYoutubeVideo(props.videoId).then(video => {
                if (video == null){
                    setFetchError(FetchErrorType.idDoesNotExist);
                } else {
                    setVideoInfo(video);
                }
            }).catch(() => {
                setFetchError(FetchErrorType.requestFailed);
            });
        }, [props.videoId]);

        return <SpacerView style={styles.root} space={10}>
            <AspectRatioView heightPercentageOfWidth={9 / 16} style={styles.imageHolder} innerHolderViewStyle={styles.innerImageHolder}>
                {videoInfo != null &&
                    <Image style={styles.image} source={{ uri: videoInfo.thumbnailImageURL }} />}
                {fetchError != null &&
                    <Image style={styles.errorIcon} source={AssetImages.warningIcon}/>}
            </AspectRatioView>
            <SpacerView space={3} style={styles.textHolder}>
                <CustomizedText style={styles.titleView} ellipsizeMode="tail" numberOfLines={2}>{
                    videoInfo?.title ?? `https://www.youtube.com/watch?v=${props.videoId}`
                }</CustomizedText>
                {fetchError != null && <CustomizedText style={styles.errorText}>
                    {(() => {
                        switch (fetchError){
                            case FetchErrorType.idDoesNotExist: return 'This video does not exist.';
                            case FetchErrorType.requestFailed: return 'Could not fetch. Please check your network connection.';
                        }
                    })()}
                </CustomizedText>}
            </SpacerView>
            
            <EditButton onPress={props.onDeleteButtonPressed} buttonType={EditButtonType.delete} />
        </SpacerView>
    }
    return YoutubeVideoView;
})();








interface AddYoutubeVideoViewProps {
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
                <EditButton isEnabled={shouldAddButtonBeEnabled} buttonType={EditButtonType.add} onPress={() => {
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






enum EditButtonType {
    add,
    delete,
}


interface EditButtonProps {
    buttonType: EditButtonType;
    onPress: () => void;
    isEnabled?: boolean;
}

const EditButton = (() => {

    const styles = StyleSheet.create({
        root: {
        },
        buttonContentView: {
            width: 40,
            height: 40,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
        },
        deleteImage: {
            height: '50%',
            width: '50%',
            tintColor: 'white'
        }
    });

    const EditButton = (props: EditButtonProps) => {

        const backgroundColor = (() => {
            switch (props.buttonType) {
                case EditButtonType.delete: return CustomColors.redColor;
                default: return CustomColors.themeGreen;
            }
        })().stringValue;

        const isEnabled = props.isEnabled ?? true;

        return <BouncyButton
            style={styles.root}
            contentViewProps={{ style: [styles.buttonContentView, { backgroundColor, opacity: isEnabled ? 1 : 0.5 }] }}
            onPress={props.onPress}
            pointerEvents={isEnabled ? undefined : 'none'}
        >
            <Image source={(() => {
                switch (props.buttonType) {
                    case EditButtonType.add: return AssetImages.plusIcon;
                    case EditButtonType.delete: return AssetImages.deleteIcon;
                }
            })()} style={styles.deleteImage} />
        </BouncyButton>
    }
    return EditButton;
})();

