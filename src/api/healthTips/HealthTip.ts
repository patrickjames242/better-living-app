import { Optional } from "../../helpers/general";
import { List } from "immutable";

const dateFormatter = Intl.DateTimeFormat('en-us', {month: 'short', day: 'numeric', year: 'numeric'});



export default class HealthTip {
    constructor(
        readonly id: number,
        readonly title: string,
        readonly date: Date,
        readonly youtubeVideoIDs: List<string>,
        readonly audioUrls: List<{id: number, url: string}>,
        readonly articleText: Optional<string>,
    ) {
        if (typeof id !== 'number') { throw new Error('id incorrectly typed'); }
        if (typeof title !== 'string') { throw new Error('title incorrectly typed'); }
        if ((date instanceof Date) === false) { throw new Error('date incorrectly typed'); }
        if (((youtubeVideoIDs instanceof List) == false) || youtubeVideoIDs.some(x => typeof x !== 'string')) { 
            throw new Error('youtubeVideoIds incorrectly typed'); 
        }
        if (((audioUrls instanceof List) == false) || audioUrls.some(x => typeof (x as any)?.id !== 'number' || typeof (x as any)?.url !== 'string')) { 
            throw new Error('audioUrls incorrectly typed'); 
        }
        if (typeof articleText !== 'string' && articleText !== null) { throw new Error('articleText incorrectly typed'); }
    }

    getFormattedDateString(){
        return dateFormatter.format(this.date);
    }

    
}
