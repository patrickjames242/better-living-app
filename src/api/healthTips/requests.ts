
import { Optional, getPropsFromObject } from "../../helpers/general";
import { fetchFromAPI, HttpMethod } from "../api";
import { getHealthTipFromObject_orThrow } from "./helpers";
import store from "../../redux/store";
import { insertOrUpdateHealthTipAction, deleteHealthTipAction, } from "../../redux/healthTips";
import { List } from "immutable";
import { HealthTipJsonKeys, HealthTipFormDataKeys } from "./validation";

const basePath = 'health-tips/';


export interface HealthTipRequestObj{
    [HealthTipJsonKeys.title]: string,
    [HealthTipJsonKeys.article_text]: Optional<string>,
    [HealthTipJsonKeys.yt_video_ids]?: string[];
    audioFilesToInsert?: List<File>,
    audioFilesToDelete?: List<number>,
}


function getBodyForRequestObject(obj: Partial<HealthTipRequestObj>): FormData{
    
    const json: object | undefined = (() => {
        const filteredObj = getPropsFromObject(obj, [
            HealthTipJsonKeys.title, 
            HealthTipJsonKeys.article_text, 
            HealthTipJsonKeys.yt_video_ids
        ]);
        return Object.getOwnPropertyNames(filteredObj).length >= 1 ? filteredObj : undefined;
    })();

    const formData = new FormData();
    json != undefined && formData.append(HealthTipFormDataKeys.json, JSON.stringify(json));

    for (const audioFileId of obj.audioFilesToDelete?.toArray() ?? []){
        formData.append(HealthTipFormDataKeys.deleteAudioFile, String(audioFileId));
    }
    for (const audioFile of obj.audioFilesToInsert?.toArray() ?? []){
        formData.append(HealthTipFormDataKeys.insertAudioFile, audioFile, audioFile.name);
    }
    return formData;
}

export function createNewHealthTip(healthTip: HealthTipRequestObj){
    return fetchFromAPI({
        method: HttpMethod.post,
        path: basePath + 'create/',
        rawBody: getBodyForRequestObject(healthTip),
    }).then(response => {
        const healthTip = getHealthTipFromObject_orThrow(response);
        store.dispatch(insertOrUpdateHealthTipAction(healthTip));
        return healthTip;
    });
}

export function updateHealthTip(id: number, requestObj: Partial<HealthTipRequestObj>){
    return fetchFromAPI({
        path: basePath + id + '/',
        method: HttpMethod.put,
        rawBody: getBodyForRequestObject(requestObj),
    }).then(response => {
        const healthTip = getHealthTipFromObject_orThrow(response);
        store.dispatch(insertOrUpdateHealthTipAction(healthTip));
        return healthTip;
    });
}

export function deleteHealthTip(id: number){
    return fetchFromAPI({
        method: HttpMethod.delete,
        path: basePath + id + '/'
    }).then(() => {
        store.dispatch(deleteHealthTipAction(id));
    });
}


