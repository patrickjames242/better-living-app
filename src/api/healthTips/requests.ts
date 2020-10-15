
import { Optional, getPropsFromObject } from "../../helpers/general";
import { fetchFromAPI, HttpMethod } from "../api";
import { List } from "immutable";
import { HealthTipJsonKeys, HealthTipFormDataKeys, HealthTipJsonResponseObj } from "./validation";
import HealthTip from "./HealthTip";

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
    return fetchFromAPI<HealthTipJsonResponseObj>({
        method: HttpMethod.post,
        path: basePath + 'create/',
        rawBody: getBodyForRequestObject(healthTip),
    }).then(response => {
        return new HealthTip(response);
    });
}

export function updateHealthTip(id: number, requestObj: Partial<HealthTipRequestObj>){
    return fetchFromAPI<HealthTipJsonResponseObj>({
        path: basePath + id + '/',
        method: HttpMethod.put,
        rawBody: getBodyForRequestObject(requestObj),
    }).then(response => {
        return new HealthTip(response);
    });
}

export function deleteHealthTip(id: number){
    return fetchFromAPI<null>({
        method: HttpMethod.delete,
        path: basePath + id + '/'
    });
}


export function getAllHealthTips(maxAmount?: number, maxDate?: string){
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




