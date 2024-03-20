import React, { useMemo, useState } from 'react';
import {
  Optional,
  mapOptional,
  DefaultKeyboardConfigs,
} from '../../../helpers/general';
import store from '../../../redux/store';
import {
  updateHealthTip,
  createNewHealthTip,
  HealthTipRequestObj,
} from '../../../api/healthTips/requests';
import CreateOrEditTipYoutubeSection from './CreateOrEditTipYoutubeSection/CreateOrEditTipYoutubeSection';
import { List, Set } from 'immutable';
import CreateOrEditTipAudioFilesSection from './CreateOrEditTipAudioFilesSection/CreateOrEditTipAudioFilesSection';
import { HealthTipAudioFile } from '../../../api/healthTips/HealthTip';
import { StackScreenProps, StackNavigationProp } from '@react-navigation/stack';
import { TipsNavStackParamList } from '../navigationHelpers';
import { useNavigation } from '@react-navigation/native';
import GenericEditingFormScreen from '../../../helpers/Views/GenericEditingFormScreen';
import { DefaultLongButtonsProps } from '../../../helpers/Buttons/LongTextAndIconButton';
import { displayErrorMessage } from '../../../helpers/Alerts';
import { RNFileForUpload } from '../../../helpers/RNFileForUpload';
import { Formik } from '../../../helpers/formik';
import * as yup from 'yup';
import {
  FormikMultilineTextFieldView,
  FormikTextFieldView,
} from '../../../helpers/Views/FormikTextFieldView';

const CreateOrEditTipScreen = (() => {
  function getInitialFieldValues(tipId: Optional<number>): {
    title: string;
    articleText: string;
    ytVideoIds: List<string>;
    audioFiles: List<HealthTipAudioFile>;
  } {
    const healthTip = mapOptional(tipId, x =>
      store.getState().healthTips.get(x),
    );
    if (healthTip == null) {
      return {
        title: '',
        articleText: '',
        ytVideoIds: List(),
        audioFiles: List(),
      };
    } else {
      return {
        title: healthTip.title,
        articleText: healthTip.articleText ?? '',
        ytVideoIds: healthTip.youtubeVideoIDs,
        audioFiles: healthTip.audioFiles,
      };
    }
  }

  interface FormikValues {
    title: string;
    articleText: string;
  }

  const CreateOrEditTipScreen = (
    props: StackScreenProps<TipsNavStackParamList, 'CreateOrEditTip'>,
  ) => {
    const initialFieldValues = useMemo(() => {
      return getInitialFieldValues(props.route.params.tipIdToEdit);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [ytVideoIds, setYtVideoIds] = useState(initialFieldValues.ytVideoIds);
    const [audioFilesToAdd, setAudioFilesToAdd] = useState(
      List<RNFileForUpload>(),
    );
    const [audioFilesToDelete, setAudioFilesToDelete] = useState(Set<number>());

    const navigationBarTitle = (() => {
      if (props.route.params.tipIdToEdit == null) {
        return 'Create New Health Tip';
      } else {
        return 'Edit Health Tip';
      }
    })();

    const navigation =
      useNavigation<
        StackNavigationProp<TipsNavStackParamList, 'CreateOrEditTip'>
      >();

    return (
      <Formik<FormikValues>
        initialValues={{
          title: initialFieldValues.title,
          articleText: initialFieldValues.articleText,
        }}
        validationSchema={yup.object({
          title: yup.string().trim().required('Title field required'),
          articleText: yup.string(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          const article_text = (() => {
            const x = values.articleText.trim();
            return x.length <= 0 ? null : x;
          })();

          const requestObj: HealthTipRequestObj = {
            title: values.title.trim(),
            article_text: article_text,
            yt_video_ids: ytVideoIds.toArray(),
            audioFilesToInsert: audioFilesToAdd,
            audioFilesToDelete: audioFilesToDelete.toList(),
          };

          setSubmitting(true);
          (props.route.params.tipIdToEdit == null
            ? createNewHealthTip(requestObj)
            : updateHealthTip(props.route.params.tipIdToEdit, requestObj)
          )
            .then(() => {
              navigation.goBack();
            })
            .catch(error => {
              displayErrorMessage(error.message);
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {formik => {
          return (
            <GenericEditingFormScreen
              navBarTitle={navigationBarTitle}
              longButtons={[
                {
                  ...DefaultLongButtonsProps.saveChanges,
                  onPress: formik.submitForm,
                  isLoading: formik.isSubmitting,
                },
              ]}
            >
              <FormikTextFieldView<FormikValues>
                formikFieldName="title"
                topTitleText="Title"
                textInputProps={DefaultKeyboardConfigs.title}
              />
              <CreateOrEditTipYoutubeSection
                videoIds={ytVideoIds}
                onDeleteVideoId={videoId => {
                  setYtVideoIds(i => i.filter(x => x !== videoId));
                }}
                onAddVideoId={videoId => {
                  setYtVideoIds(x =>
                    x.filter(x => x !== videoId).push(videoId),
                  );
                }}
              />
              <CreateOrEditTipAudioFilesSection
                audioFiles={initialFieldValues.audioFiles}
                addedAudioFiles={audioFilesToAdd}
                deletedAudioFileIds={audioFilesToDelete}
                onUserWantsToAddFile={file =>
                  setAudioFilesToAdd(x => x.push(file))
                }
                onUserWantsToRemoveAddedFile={file =>
                  setAudioFilesToAdd(x => x.filter(y => y !== file))
                }
                onUserWantsToRemoveExistingFile={id =>
                  setAudioFilesToDelete(x => x.add(id))
                }
              />
              <FormikMultilineTextFieldView<FormikValues>
                formikFieldName="articleText"
                topTitleText="Description"
                textInputProps={DefaultKeyboardConfigs.description}
              />
            </GenericEditingFormScreen>
          );
        }}
      </Formik>
    );
  };
  return CreateOrEditTipScreen;
})();

export default CreateOrEditTipScreen;
