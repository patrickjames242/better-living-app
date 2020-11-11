import { Platform } from "react-native";
import URLParse from "url-parse";
import * as mimeTypes from 'react-native-mime-types';

export class RNFileForUpload{

    constructor(
        private readonly fileInfo: {file: File} | {uri: string, name?: string, defaultFileType?: string},
    ){
        if (
            Platform.OS !== 'web' && 
            (fileInfo as any).file instanceof File
        ){
            throw new Error("using files to istantiate RNFileForUpload on platforms other then the web is not supported");
        }
    }

    getFormDataValue: () => File | {uri: string, name: string, type: string} = () => {
        const _fileInfo = this.fileInfo as any;
        if (_fileInfo.file){
            return _fileInfo.file;
        } else {
            return {
                uri: _fileInfo.uri,
                name: _fileInfo.name ?? (() => { 
                    const paths = URLParse(_fileInfo.uri).pathname.split('/').filter(x => x !== '');
                    return paths[paths.length - 1];
                })(),
                type: (() => {
                    const mimeType = mimeTypes.lookup(_fileInfo.name ?? _fileInfo.uri);
                    return typeof mimeType === 'string' ? mimeType : _fileInfo.defaultFileType;
                })(),
            }
        }
    }
}


