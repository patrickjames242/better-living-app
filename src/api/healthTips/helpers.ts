
import { useMemo } from "react";
import { useSelector } from "../../redux/store";


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




