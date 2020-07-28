
import { useMemo } from "react";
import { useSelector } from "../../redux/store";
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
    return new HealthTip(object as any);
}

export function getHealthTipFromObject_orNull(object: { [index: string]: any }) {
    try {
        return getHealthTipFromObject_orThrow(object);
    } catch (error) {
        console.error("a health tip object could not be converted because of an error ->", error, object);
        return null;
    }
}



