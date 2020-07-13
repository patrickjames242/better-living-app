
import { Optional } from "../../helpers/general";
import { fetchFromAPI, HttpMethod } from "../api";
import { getHealthTipFromObject_orThrow } from "./helpers";
import store from "../../redux/store";
import { insertOrUpdateHealthTipAction, deleteHealthTipAction, } from "../../redux/healthTips";
import { List } from "immutable";

const basePath = 'health-tips/';

const JsonKeys: {
    readonly json: 'json',
    readonly title: 'title',
    readonly articleText: 'article_text',
    readonly ytVideoIds: 'yt_video_ids',
    readonly insertAudioFile: 'insert_audio_file',
    readonly deleteAudioFile: 'delete_audio_file',
} = {
    json: 'json',
    title: 'title',
    articleText: 'article_text',
    ytVideoIds: 'yt_video_ids',
    insertAudioFile: 'insert_audio_file',
    deleteAudioFile: 'delete_audio_file',
}


export interface HealthTipRequestObj{
    [JsonKeys.title]: string,
    [JsonKeys.articleText]: Optional<string>,
    [JsonKeys.ytVideoIds]?: string[]
    audioFilesToInsert?: List<File>,
    audioFilesToDelete?: List<number>,
}


function getBodyForRequestObject(obj: Partial<HealthTipRequestObj>): FormData{
    
    const json: object | undefined = (() => {
        const jsonObject: {[index: string]: any} = {};
        for (const key of [JsonKeys.title, JsonKeys.articleText, JsonKeys.ytVideoIds]){
            const value = obj[key];
            if (value === undefined){continue;}
            jsonObject[key] = value;
        }
        return Object.getOwnPropertyNames(jsonObject).length >= 1 ? jsonObject : undefined;
    })();

    const formData = new FormData();

    json != undefined && formData.append(JsonKeys.json, JSON.stringify(json));

    for (const audioFileId of obj.audioFilesToDelete?.toArray() ?? []){
        formData.append(JsonKeys.deleteAudioFile, String(audioFileId));
    }

    for (const audioFile of obj.audioFilesToInsert?.toArray() ?? []){
        formData.append(JsonKeys.insertAudioFile, audioFile, audioFile.name);
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



