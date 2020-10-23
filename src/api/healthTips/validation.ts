
import { Optional } from "../../helpers/general";
import ajv from "ajv";

export const HealthTipFormDataKeys: {
    readonly json: 'json',
    readonly insertAudioFile: 'insert_audio_file',
    readonly deleteAudioFile: 'delete_audio_file',
} = {
    json: 'json',
    insertAudioFile: 'insert_audio_file',
    deleteAudioFile: 'delete_audio_file',
}

export const HealthTipJsonKeys: {
    id: 'id',
    title: 'title',
    date: 'date',
    audio_files: 'audio_files',
    AudioFile: {
        id: 'id',
        original_file_name: 'original_file_name',
        url: 'url',
    },
    yt_video_ids: 'yt_video_ids',
    article_text: 'article_text',
} = {
    id: 'id',
    title: 'title',
    date: 'date',
    audio_files: 'audio_files',
    AudioFile: {
        id: 'id',
        original_file_name: 'original_file_name',
        url: 'url',
    },
    yt_video_ids: 'yt_video_ids',
    article_text: 'article_text',
}

export interface HealthTipJsonResponseObj{
    [HealthTipJsonKeys.id]: number;
    [HealthTipJsonKeys.title]: string;
    [HealthTipJsonKeys.date]: string;
    [HealthTipJsonKeys.audio_files]: {
        [HealthTipJsonKeys.AudioFile.id]: number;
        [HealthTipJsonKeys.AudioFile.original_file_name]: string;
        [HealthTipJsonKeys.AudioFile.url]: string;
    }[];
    [HealthTipJsonKeys.yt_video_ids]: string[],
    [HealthTipJsonKeys.article_text]: Optional<string>,
}


const HealthTipApiResponseSchema = {
    type: 'object',
    properties: {
        [HealthTipJsonKeys.id]: { type: 'number' },
        [HealthTipJsonKeys.title]: { type: 'string' },
        [HealthTipJsonKeys.date]: { type: 'string', format: 'date-time' },
        [HealthTipJsonKeys.audio_files]: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    [HealthTipJsonKeys.AudioFile.id]: { type: 'number' },
                    [HealthTipJsonKeys.AudioFile.original_file_name]: { type: 'string' },
                    [HealthTipJsonKeys.AudioFile.url]: { type: 'string' },
                }
            }
        },
        [HealthTipJsonKeys.yt_video_ids]: {
            type: 'array',
            items: { type: 'string' }
        },
        [HealthTipJsonKeys.article_text]: { type: ['string', 'null'] },
    },
    required: [
        HealthTipJsonKeys.id, 
        HealthTipJsonKeys.title, 
        HealthTipJsonKeys.date, 
        HealthTipJsonKeys.audio_files, 
        HealthTipJsonKeys.yt_video_ids, 
        HealthTipJsonKeys.article_text
    ]
};

export const healthTipResponseObjValidator = (new ajv({allErrors: true})).compile(HealthTipApiResponseSchema);

