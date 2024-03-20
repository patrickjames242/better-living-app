import { Optional, getPropsFromObject } from '../../helpers/general';
import { fetchFromAPI, HttpMethod } from '../api';
import { List } from 'immutable';
import {
  HealthTipJsonKeys,
  HealthTipFormDataKeys,
  HealthTipJsonResponseObj,
} from './validation';
import HealthTip from './HealthTip';
import { getExpoNotificationDeviceTokenIfPossible } from '../authentication/authRequests';
import { RNFileForUpload } from '../../helpers/RNFileForUpload';

const basePath = 'health-tips/';

export interface HealthTipRequestObj {
  [HealthTipJsonKeys.title]: string;
  [HealthTipJsonKeys.article_text]: Optional<string>;
  [HealthTipJsonKeys.yt_video_ids]?: string[];
  audioFilesToInsert?: List<RNFileForUpload>;
  audioFilesToDelete?: List<number>;
}

async function getBodyForRequestObject(
  obj: Partial<HealthTipRequestObj>,
  includeNotificationDeviceId?: boolean,
): Promise<FormData> {
  const CURRENT_NOTIFICATION_DEVICE_ID_KEY: 'current_notification_device_id' =
    'current_notification_device_id';
  const notificationDeviceId = includeNotificationDeviceId
    ? await getExpoNotificationDeviceTokenIfPossible()
    : undefined;

  const json: object | undefined = (() => {
    const filteredObj = getPropsFromObject(
      {
        ...obj,
        [CURRENT_NOTIFICATION_DEVICE_ID_KEY]: notificationDeviceId,
      },
      [
        HealthTipJsonKeys.title,
        HealthTipJsonKeys.article_text,
        HealthTipJsonKeys.yt_video_ids,
        CURRENT_NOTIFICATION_DEVICE_ID_KEY,
      ],
    );
    return Object.getOwnPropertyNames(filteredObj).length >= 1
      ? filteredObj
      : undefined;
  })();

  const formData = new FormData();
  json != undefined &&
    formData.append(HealthTipFormDataKeys.json, JSON.stringify(json));

  for (const audioFileId of obj.audioFilesToDelete?.toArray() ?? []) {
    formData.append(HealthTipFormDataKeys.deleteAudioFile, String(audioFileId));
  }
  for (const audioFile of obj.audioFilesToInsert?.toArray() ?? []) {
    const formDataValue = audioFile.getFormDataValue();
    formData.append(
      HealthTipFormDataKeys.insertAudioFile,
      formDataValue as any,
      formDataValue.name,
    );
  }
  return formData;
}

export async function getHealthTip(healthTipId: number) {
  return fetchFromAPI<HealthTipJsonResponseObj>({
    method: HttpMethod.get,
    path: basePath + healthTipId + '/',
  }).then(response => {
    return new HealthTip(response);
  });
}

export async function createNewHealthTip(healthTip: HealthTipRequestObj) {
  return fetchFromAPI<HealthTipJsonResponseObj>({
    method: HttpMethod.post,
    path: basePath + 'create/',
    rawBody: await getBodyForRequestObject(healthTip, true),
  }).then(response => {
    return new HealthTip(response);
  });
}

export async function updateHealthTip(
  id: number,
  requestObj: Partial<HealthTipRequestObj>,
) {
  return fetchFromAPI<HealthTipJsonResponseObj>({
    path: basePath + id + '/',
    method: HttpMethod.put,
    rawBody: await getBodyForRequestObject(requestObj),
  }).then(response => {
    return new HealthTip(response);
  });
}

export function deleteHealthTip(id: number) {
  return fetchFromAPI<null>({
    method: HttpMethod.delete,
    path: basePath + id + '/',
  });
}

export function getAllHealthTips(maxAmount?: number, maxDate?: string) {
  let url = basePath + `?`;

  url += [
    ...(maxAmount == null ? [] : [`maxAmount=${maxAmount}`]),
    ...(maxDate == null ? [] : [`maxDate=${maxDate}`]),
  ].join('&');

  return fetchFromAPI<HealthTipJsonResponseObj[]>({
    method: HttpMethod.get,
    path: url,
  }).then(healthTips => {
    return healthTips.map(x => new HealthTip(x));
  });
}
