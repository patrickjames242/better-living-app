
import { MenuJsonResponseObj } from "./validation";
import Menu from "./Menu";
import { Optional } from "../../../helpers/general";
import store, { addSelectedStateListener, AppState } from "../../../redux/store";
import { Map } from "immutable";
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
    return moment.tz('America/Nassau')
}

function getMoment(timeString: string){
    return moment.tz(timeString, 'HH:mm:ss', 'America/Nassau');
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
        menu.dayOfTheWeek !== currentDayOfTheWeek || 
        menu.startTime == null || 
        menu.endTime == null
    ){return false;}

    const startTimeSeconds = getSecondsSinceDayBeginning(getMoment(menu.startTime));
    const endTimeSeconds = getSecondsSinceDayBeginning(getMoment(menu.endTime));

    return (currentTimeSeconds >= startTimeSeconds && currentTimeSeconds < endTimeSeconds);
}

function calculateCurrentMenu(menusState: Map<number, Menu>): Optional<Menu>{
    const iterator = menusState.values()

    let currentNext = iterator.next();
    
    while (currentNext.done !== true){
        const menu = currentNext.value as Menu;
        if (calculateIsCurrentMenu(menu) === true){return menu;}
        currentNext = iterator.next();
    }

    return null;
}

const selectMenusState = (state: AppState) => state.orderingSystem.menus;

const currentMenuHolder = new ValueBox<Optional<Menu>>(calculateCurrentMenu(selectMenusState(store.getState())));

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

setInterval(() => {

    updateCurrentMenuIfNeeded()

}, 1000 * 60);

export const getCurrentMenu = () => currentMenuHolder.value;

export function addCurrentMenuListener(listener: (menu: Optional<Menu>) => void){
    return currentMenuHolder.observer.addListener(menu => {
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

