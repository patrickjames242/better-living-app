
import { useMemo } from "react";
import { useSelector } from "../../redux/store";
import { List } from "immutable";
import HealthTip from "./HealthTip";


export function useAllHealthTipsList(){
    const healthTipsMap = useSelector(state => state.healthTips);
    return useMemo(() => {
        return healthTipsMap.toList();
    }, [healthTipsMap]);
}

export function useAllHealthTipsArray(){
    const healthTipsMap = useSelector(state => state.healthTips);
    return useMemo(() => {
        return healthTipsMap.toList().toArray();
    }, [healthTipsMap]);
}

export function getHealthTipFromObject_orThrow(object: {[index: string]: any}){
    const yt_ids = List<string>(object.yt_video_ids);
    const audio_urls = List<string>(object.audio_urls);
    return new HealthTip(object.id, object.title, new Date(object.date), yt_ids, audio_urls, object.article_text);
}


export function getHealthTipFromObject_orNull(object: { [index: string]: any }) {
    try {
        return getHealthTipFromObject_orThrow(object);
    } catch (error) {
        console.error("a health tip object could not be converted because of an error ->", error, object);
        return null;
    }
}



