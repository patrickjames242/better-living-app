import AppSettings from "../settings";
import store from "../redux/store";



const API_URL = (() => {
    const apiProtocol = AppSettings.useLocalHostDevServer ? 'http' : 'https';
    return `${apiProtocol}://${AppSettings.apiHostUrl()}/`;
})();

export enum HttpMethod{
    get,
    post,
    put,
    delete,
}

function getHttpMethodText(method: HttpMethod){
    switch (method){
        case HttpMethod.get: return 'GET';
        case HttpMethod.post: return 'POST';
        case HttpMethod.put: return 'PUT';
        case HttpMethod.delete: return 'DELETE';
    }
}

export type ApiResponse = {isSuccess: true, data: any} | {isSuccess: false, errorMessage: string}

/// jsonBody will automatically be converted to a string using JSON.stringify()
export async function fetchFromAPI<JsonResult = any>(props: {
    method: HttpMethod, 
    path: string, 
    jsonBody?: any, 
    rawBody?: BodyInit, 
}): Promise<JsonResult>{
    const headersToSend: {[property: string]: string} = {};
    let bodyToSend: BodyInit | undefined

    if (props.jsonBody != undefined){
        bodyToSend = JSON.stringify(props.jsonBody);
        headersToSend['Content-Type'] = 'application/json';
    } else if (props.rawBody != undefined){
        bodyToSend = props.rawBody;
    } else {
        bodyToSend = undefined;
    }

    const authToken = store.getState().authentication?.authToken ?? undefined;

    const response = await fetch(API_URL + props.path, {
        method: getHttpMethodText(props.method),
        body: bodyToSend,
        headers: {
            ...(authToken ? {'Auth-Token': authToken} : {}),
            ...headersToSend
        },
    });
    const json = await (response.json() as Promise<ApiResponse>);
    if (json.isSuccess) {
        return json.data;
    } else {
        return Promise.reject(new Error(json.errorMessage));
    }
}








