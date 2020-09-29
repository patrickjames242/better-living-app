
import React, { useState, useEffect } from "react";
import { Image, StyleSheet } from 'react-native';
import { CustomColors } from "../../../src/helpers/colors";
import { CustomFont } from "../../../src/helpers/fonts/fonts";
import { Optional } from "../../../src/helpers/general";
import { YoutubeVideo, fetchYoutubeVideo } from "../../../src/api/youtube";
import SpacerView from "../../../src/helpers/Spacers/SpacerView";
import AspectRatioView from "../../../src/helpers/Views/AspectRatioView";
import AssetImages from "../../../src/images/AssetImages";
import CustomizedText from "../../../src/helpers/Views/CustomizedText";
import CreateOrEditTipEditButton, { CreateOrEditTipEditButton_EditButtonType } from "../CreateOrEditTipEditButton";
import CreateOrEditTipAttachmentContainer from "../CreateOrEditTipAttachmentContainer";
import Spacer from "../../../src/helpers/Spacers/Spacer";


interface YoutubeVideoViewProps {
    videoId: string;
    onDeleteButtonPressed: () => void;
}

const YoutubeVideoView = (() => {

    const styles = StyleSheet.create({
        root: {
            flexDirection: 'row',
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
        },
        titleView: {
            fontSize: 15,
            fontFamily: CustomFont.medium,
        },
        errorText: {
            color: CustomColors.redColor.stringValue,
            fontFamily: CustomFont.medium,
            fontSize: 15,
        },

    });

    enum FetchErrorType {
        idDoesNotExist,
        requestFailed,
    }

    const YoutubeVideoView = (props: YoutubeVideoViewProps) => {

        const [videoInfo, setVideoInfo] = useState<Optional<YoutubeVideo>>(null);
        const [fetchError, setFetchError] = useState<Optional<FetchErrorType>>(null);

        useEffect(() => {
            fetchYoutubeVideo(props.videoId).then(video => {
                if (video == null) {
                    setFetchError(FetchErrorType.idDoesNotExist);
                } else {
                    setVideoInfo(video);
                }
            }).catch(() => {
                setFetchError(FetchErrorType.requestFailed);
            });
        }, [props.videoId]);

        return <CreateOrEditTipAttachmentContainer style={styles.root}>
            <Spacer space={10}>
                <AspectRatioView heightPercentageOfWidth={9 / 16} style={styles.imageHolder} innerHolderViewStyle={styles.innerImageHolder}>
                    {videoInfo != null &&
                        <Image style={styles.image} source={{ uri: videoInfo.thumbnailImageURL }} />}
                    {fetchError != null &&
                        <Image style={styles.errorIcon} source={AssetImages.warningIcon} />}
                </AspectRatioView>
                <SpacerView space={3} style={styles.textHolder}>
                    <CustomizedText style={styles.titleView} ellipsizeMode="tail" numberOfLines={2}>{
                        videoInfo?.title ?? `https://www.youtube.com/watch?v=${props.videoId}`
                    }</CustomizedText>
                    {fetchError != null && <CustomizedText style={styles.errorText}>
                        {(() => {
                            switch (fetchError) {
                                case FetchErrorType.idDoesNotExist:
                                    return 'This video does not exist.';
                                case FetchErrorType.requestFailed:
                                    return 'Could not fetch. Please check your network connection.';
                            }
                        })()}
                    </CustomizedText>}
                </SpacerView>
                <CreateOrEditTipEditButton onPress={props.onDeleteButtonPressed} buttonType={CreateOrEditTipEditButton_EditButtonType.delete} />
            </Spacer>
        </CreateOrEditTipAttachmentContainer>
    }
    return YoutubeVideoView;
})();


export default YoutubeVideoView;