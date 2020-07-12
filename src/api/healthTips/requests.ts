
import { Optional } from "../../helpers/general";
import { fetchFromAPI, HttpMethod } from "../api";
import { getHealthTipFromObject_orThrow } from "./helpers";
import store from "../../redux/store";
import { insertOrUpdateHealthTipAction, deleteHealthTipAction } from "../../redux/healthTips";

const basePath = 'health-tips/';

export interface HealthTipRequestObj{
    title: string,
    article_text: Optional<string>,
    yt_video_ids?: string[]
    audio_files_to_insert?: File[],
    audio_files_to_delete?: number[],
}

export function createNewHealthTip(healthTip: HealthTipRequestObj){
    return fetchFromAPI({
        method: HttpMethod.post,
        path: basePath + 'create/',
        jsonBody: healthTip,
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
        jsonBody: requestObj,
    }).then(response => {
        const healthTip = getHealthTipFromObject_orThrow(response);
        store.dispatch(insertOrUpdateHealthTipAction(healthTip));
        return healthTip;
    })
}

export function deleteHealthTip(id: number){
    return fetchFromAPI({
        method: HttpMethod.delete,
        path: basePath + id + '/'
    }).then(() => {
        store.dispatch(deleteHealthTipAction(id));
    });
}



