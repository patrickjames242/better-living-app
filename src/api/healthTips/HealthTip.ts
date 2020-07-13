
import { Optional } from "../../helpers/general";
import { List } from "immutable";

const dateFormatter = Intl.DateTimeFormat('en-us', { month: 'short', day: 'numeric', year: 'numeric' });

export interface HealthTipAudioFile {
    id: number,
    url: string,
    originalFileName: string,
}

export default class HealthTip {

    constructor(
        readonly id: number,
        readonly title: string,
        readonly date: Date,
        readonly youtubeVideoIDs: List<string>,
        readonly audioFiles: List<HealthTipAudioFile>,
        readonly articleText: Optional<string>,
    ) {
        if (typeof id !== 'number') {
            throw new Error('id incorrectly typed');
        }
        if (typeof title !== 'string') {
            throw new Error('title incorrectly typed');
        }
        if ((date instanceof Date) === false) {
            throw new Error('date incorrectly typed');
        }
        if (
            ((youtubeVideoIDs instanceof List) == false) ||
            youtubeVideoIDs.some(x => typeof x !== 'string')
        ) {
            throw new Error('youtubeVideoIds incorrectly typed');
        }
        if (
            ((audioFiles instanceof List) == false) ||
            audioFiles.some(x =>
                typeof x?.id !== 'number' ||
                typeof x?.url !== 'string' ||
                typeof x?.originalFileName !== 'string'
            )
        ) {
            throw new Error('audioUrls incorrectly typed');
        }
        if (
            typeof articleText !== 'string' &&
            articleText !== null
        ) { throw new Error('articleText incorrectly typed'); }
    }

    getFormattedDateString() {
        return dateFormatter.format(this.date);
    }


}
