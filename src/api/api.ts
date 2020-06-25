


const API_URL = 'http://127.0.0.1:8000/';

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
export async function fetchFromAPI(props: {
    method: HttpMethod, 
    path: string, 
    jsonBody?: any, 
    rawBody?: BodyInit, 
}){
    const bodyToSend = (() => {
        if (props.jsonBody != undefined){
            return JSON.stringify(props.jsonBody);
        } else if (props.rawBody != undefined){
            return props.rawBody;
        } else {
            return undefined;
        }
    })();
    const response = await fetch(API_URL + props.path, {
        method: getHttpMethodText(props.method),
        body: bodyToSend
    });
    return response.json() as Promise<ApiResponse>;
}








