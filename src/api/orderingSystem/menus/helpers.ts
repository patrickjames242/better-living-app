
import { MenuJsonResponseObj } from "./validation";
import Menu from "./Menu";
import { Optional, mapOptional, NASSAU_TIME_ZONE } from "../../../helpers/general";
import store, { addSelectedStateListener, AppState } from "../../../redux/store";
import { Map, Set } from "immutable";
import moment, { Moment } from 'moment-timezone';
import ValueBox from "../../../helpers/ValueBox";
import { useEffect, useState } from "react";




export function getMenuFromJsonResponseObj_orNull(apiResponseObj: MenuJsonResponseObj){
    try{
        return new Menu(apiResponseObj);
    } catch (error){
        console.error('A menu could not be converted from json because of the following error ->', error, apiResponseObj);
        return null;
    }
}

function getCurrentMoment(){
    return moment.tz(NASSAU_TIME_ZONE)
}

function getMoment(timeString: string){
    return moment.tz(timeString, 'HH:mm:ss', NASSAU_TIME_ZONE);
}

function getSecondsSinceDayBeginning(moment: Moment){
    const seconds = (moment.hours() * 60 * 60) + (moment.minutes() * 60) + moment.seconds() + (moment.milliseconds() / 1000);
    return seconds;
}

function calculateIsCurrentMenu(menu: Menu){
    const currentMoment = getCurrentMoment();
    const currentDayOfTheWeek = currentMoment.day();
    const currentTimeSeconds = getSecondsSinceDayBeginning(currentMoment); 
    
    if (
        store.getState().globalSettings.isOrderingSystemEnabled === false ||
        menu.isActive === false ||
        menu.daysOfTheWeek.contains(currentDayOfTheWeek) === false || 
        menu.startTime == null || 
        menu.endTime == null
    ){return false;}

    const startTimeSeconds = getSecondsSinceDayBeginning(getMoment(menu.startTime));
    const endTimeSeconds = getSecondsSinceDayBeginning(getMoment(menu.endTime));

    return (currentTimeSeconds >= startTimeSeconds && currentTimeSeconds < endTimeSeconds);
}

function calculateProductIdsSetForMenu(menu: Menu){
    return Set<number>().withMutations(set => {
        menu.categories.forEach(category => {
            category.productIds.map(productId => {
                set.add(productId);
            });
        });
    });
}

function calculateCurrentMenu(menusState: Map<number, Menu>): Optional<[Menu, Set<number>]>{
    const iterator = menusState.values()

    let currentNext = iterator.next();
    
    while (currentNext.done !== true){
        const menu = currentNext.value as Menu;
        if (calculateIsCurrentMenu(menu) === true){return [menu, calculateProductIdsSetForMenu(menu)];}
        currentNext = iterator.next();
    }

    return null;
}

const selectMenusState = (state: AppState) => state.orderingSystem.menus;

const currentMenuHolder: ValueBox<Optional<[Menu, Set<number>]>> = new ValueBox(calculateCurrentMenu(selectMenusState(store.getState())));

function updateCurrentMenuIfNeeded(){
    const previousMenu = currentMenuHolder.value;
    const newValue = calculateCurrentMenu(selectMenusState(store.getState()));
    if (newValue !== previousMenu){
        currentMenuHolder.value = newValue;
    }
}

addSelectedStateListener(selectMenusState, () => {
    updateCurrentMenuIfNeeded()
});

addSelectedStateListener(state => state.globalSettings.isOrderingSystemEnabled, () => {
    updateCurrentMenuIfNeeded();
});

setInterval(() => {
    updateCurrentMenuIfNeeded()
}, 1000 * 60);






export const getCurrentMenu = () => mapOptional(currentMenuHolder.value, ([menu]) => menu);

export function addCurrentMenuListener(listener: (menu: Optional<Menu>) => void){
    return currentMenuHolder.observer.addListener(tuple => {
        const menu = mapOptional(tuple, ([menu]) => menu);
        listener(menu);
    });
}


export function useCurrentMenu(){
    const [menu, setMenu] = useState<Optional<Menu>>(getCurrentMenu());
    useEffect(() => {
        return addCurrentMenuListener(setMenu);
    }, []);
    return menu;
}






export const getProductIdsForCurrentMenu = () => mapOptional(currentMenuHolder.value, ([_, ids]) => ids) ?? Set<number>();

export function addCurrentMenuProductIdsListener(listener: (ids: Set<number>) => void){
    return currentMenuHolder.observer.addListener(tuple => {
        const ids = mapOptional(tuple, ([,ids]) => ids) ?? Set<number>();
        listener(ids);
    });
}

export function useCurrentMenuProductIds(){
    const [ids, setIds] = useState(getProductIdsForCurrentMenu());
    useEffect(() => addCurrentMenuProductIdsListener(ids => setIds(ids)), []);
    return ids;
}


