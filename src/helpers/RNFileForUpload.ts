import { Platform } from "react-native";
import URLParse from "url-parse";
import * as mimeTypes from 'react-native-mime-types';

export class RNFileForUpload{

    constructor(
        private readonly fileInfo: {file: File} | {uri: string, name?: string},
    ){
        if (Platform.OS === 'web' && (fileInfo as any).file instanceof File === false){
            throw new Error("you must include a file object on the web.")
        } else if (
            Platform.OS !== 'web' && 
            typeof (fileInfo as any).uri !== 'string'
        ){
            throw new Error("a uri is required on ios and android");
        }
    }

    getFormDataValue: () => File | {uri: string, name: string, type: string} = () => {
        const _fileInfo = this.fileInfo as any;
        return Platform.select({
            web: _fileInfo.file,
            default: {
                uri: _fileInfo.uri,
                name: _fileInfo.name ?? (() => { 
                    const paths = URLParse(_fileInfo.uri).pathname.split('/').filter(x => x !== '');
                    return paths[paths.length - 1];
                })(),
                type: (() => {
                    const mimeType = mimeTypes.lookup(_fileInfo.name ?? _fileInfo.uri);
                    return typeof mimeType === 'string' ? mimeTypes : undefined;
                })(),
            }
        })
    }

}


