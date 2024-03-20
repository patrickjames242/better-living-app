import React from 'react';
import { StyleSheet } from 'react-native';
import { TextFieldViewContainer } from '../../../../helpers/Views/TextFieldView';
import { List } from 'immutable';
import SpacerView from '../../../../helpers/Spacers/SpacerView';
import YoutubeVideoView from './YoutubeVideoView';
import AddYoutubeVideoView from './AddYoutubeVideoView';

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

  const CreateOrEditTipYoutubeSection = (
    props: CreateOrEditTipYoutubeSectionProps,
  ) => {
    return (
      <TextFieldViewContainer
        topTitleText={props.videoIds.size >= 1 ? 'YouTube Videos' : undefined}
      >
        {/* eslint-disable-next-line react/no-children-prop */}
        <SpacerView
          style={styles.contentHolderView}
          space={15}
          children={[
            ...props.videoIds
              .map(x => {
                return (
                  <YoutubeVideoView
                    key={x}
                    videoId={x}
                    onDeleteButtonPressed={() => {
                      props.onDeleteVideoId(x);
                    }}
                  />
                );
              })
              .toArray(),
            <AddYoutubeVideoView
              key="add-new-video-view"
              onSubmitYoutubeId={props.onAddVideoId}
            />,
          ]}
        />
      </TextFieldViewContainer>
    );
  };
  return CreateOrEditTipYoutubeSection;
})();

export default CreateOrEditTipYoutubeSection;
