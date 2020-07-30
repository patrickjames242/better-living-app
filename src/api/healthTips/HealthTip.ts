
import { Optional, getJsonValidatorErrorsText } from "../../helpers/general";
import { List } from "immutable";
import { HealthTipJsonResponseObj, healthTipResponseObjValidator } from "./validation";

const dateFormatter = Intl.DateTimeFormat('en-us', { month: 'short', day: 'numeric', year: 'numeric' });

export interface HealthTipAudioFile {
    id: number,
    url: string,
    originalFileName: string,
}



export default class HealthTip {

    readonly id: number;
    readonly title: string;
    readonly date: Date;
    readonly youtubeVideoIDs: List<string>;
    readonly audioFiles: List<HealthTipAudioFile>;
    readonly articleText: Optional<string>;

    constructor(apiResponseObj: HealthTipJsonResponseObj) {     

        if (healthTipResponseObjValidator(apiResponseObj) === false){
            const errorsString = (() => {
                const errorsText = getJsonValidatorErrorsText(healthTipResponseObjValidator);
                const beginningString = 'The apiResponseObj submitted to a HealthTip object is invalid.';
                if (errorsText == null){return beginningString;}
                return [beginningString, 'Here are the errors ->', errorsText].join(' ');
            })();
            
            throw new Error(errorsString);
        }

        this.id = apiResponseObj.id;
        this.title = apiResponseObj.title;
        this.date = new Date(apiResponseObj.date);
        this.youtubeVideoIDs = List(apiResponseObj.yt_video_ids);
        this.audioFiles = List(apiResponseObj.audio_files.map<HealthTipAudioFile>(x => ({
            id: x.id,
            url: x.url,
            originalFileName: x.original_file_name,
        })));
        this.articleText = apiResponseObj.article_text;
        
    }

    getFormattedDateString() {
        return dateFormatter.format(this.date);
    }
}
