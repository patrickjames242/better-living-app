
import { Optional } from "../../helpers/general";
import { List } from "immutable";
import { HealthTipJsonResponseObj, healthTipResponseObjValidator } from "./validation";
import moment from 'moment-timezone';
import { assertValidObjFromApi } from "../helpers";


export interface HealthTipAudioFile {
    id: number,
    url: string,
    originalFileName: string,
}



export default class HealthTip {

    readonly id: number;
    readonly title: string;
    readonly date: moment.Moment;
    readonly youtubeVideoIDs: List<string>;
    readonly audioFiles: List<HealthTipAudioFile>;
    readonly articleText: Optional<string>;

    constructor(apiResponseObj: HealthTipJsonResponseObj) {     

        assertValidObjFromApi(healthTipResponseObjValidator, 'HealthTip', apiResponseObj);

        this.id = apiResponseObj.id;
        this.title = apiResponseObj.title;
        this.date = moment(apiResponseObj.date);
        this.youtubeVideoIDs = List(apiResponseObj.yt_video_ids);
        this.audioFiles = List(apiResponseObj.audio_files.map<HealthTipAudioFile>(x => ({
            id: x.id,
            url: x.url,
            originalFileName: x.original_file_name,
        })));
        this.articleText = apiResponseObj.article_text;
        
    }

    getFormattedDateString() {
        return this.date.format('ll');
    }
}
