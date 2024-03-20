import React from 'react';
import { StyleSheet } from 'react-native';
import { TextFieldViewContainer } from '../../../../helpers/Views/TextFieldView';
import AddNewFileButton from './AddNewFileButton';
import { HealthTipAudioFile } from '../../../../api/healthTips/HealthTip';
import { List, Set } from 'immutable';
import Spacer from '../../../../helpers/Spacers/Spacer';
import AudioFileView from './AudioFileView';
import { RNFileForUpload } from '../../../../helpers/RNFileForUpload';

export interface CreateOrEditTipAudioFilesSectionProps {
  audioFiles: List<HealthTipAudioFile>;
  addedAudioFiles: List<RNFileForUpload>;
  deletedAudioFileIds: Set<number>;
  onUserWantsToAddFile: (file: RNFileForUpload) => void;
  onUserWantsToRemoveAddedFile: (file: RNFileForUpload) => void;
  onUserWantsToRemoveExistingFile: (id: number) => void;
}

const CreateOrEditTipAudioFilesSection = (() => {
  const styles = StyleSheet.create({
    root: {},
  });

  const CreateOrEditTipAudioFilesSection = (
    props: CreateOrEditTipAudioFilesSectionProps,
  ) => {
    const existingAudioFiles = props.audioFiles
      .toArray()
      .filter(x => props.deletedAudioFileIds.includes(x.id) === false);
    const addedAudioFiles = props.addedAudioFiles.toArray();

    return (
      <TextFieldViewContainer topTitleText="Audio Files">
        {/* eslint-disable-next-line react/no-children-prop */}
        <Spacer
          space={15}
          children={[
            ...existingAudioFiles.map((x, i) => {
              return (
                <AudioFileView
                  key={i}
                  audioFileName={x.originalFileName}
                  onDeleteButtonPressed={() =>
                    props.onUserWantsToRemoveExistingFile(x.id)
                  }
                />
              );
            }),
            ...addedAudioFiles.map((x, i) => {
              return (
                <AudioFileView
                  key={i + existingAudioFiles.length}
                  audioFileName={x.getFormDataValue().name}
                  onDeleteButtonPressed={() =>
                    props.onUserWantsToRemoveAddedFile(x)
                  }
                />
              );
            }),
            <AddNewFileButton
              key="add-new-file-button"
              onUserWantsToAddFile={props.onUserWantsToAddFile}
            />,
          ]}
        />
      </TextFieldViewContainer>
    );
  };
  return CreateOrEditTipAudioFilesSection;
})();

export default CreateOrEditTipAudioFilesSection;
