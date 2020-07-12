import { Map } from "immutable";



const YOUTUBE_API_KEY = 'AIzaSyAWlmq_XpzJeiIdnPoCPTWRjXvW1DYXtFk';


export interface YoutubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnailImageURL: string;
}

let cachedVideos = Map<string, YoutubeVideo>();


export async function fetchYoutubeVideo(videoID: string): Promise<YoutubeVideo | null> {

    const cachedVideo = cachedVideos.get(videoID, null);

    if (cachedVideo != null){
        return cachedVideo;
    }
    
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=${YOUTUBE_API_KEY}`;

    const invalidJson = new Error('Could not parse response from YouTube');

    const fetchResponse = await fetch(url, {
        method: 'GET',
    });
    const json = await fetchResponse.json();
    
    const items = json.items;
    if ((items instanceof Array) === false) {
        throw invalidJson;
    }
    if (items.length < 1) {
        return null;
    }
    const videoInfoObject = items[0]?.snippet;
    if (typeof videoInfoObject !== 'object') {      
        throw invalidJson;
    }
    const title = videoInfoObject.title;
    const description = videoInfoObject.description;
    const thumbnailImageURL = videoInfoObject.thumbnails.default?.url;
    if (typeof title !== 'string' ||
        typeof description !== 'string' ||
        typeof thumbnailImageURL !== 'string') {
        throw invalidJson;
    }

    const video = { title, description, thumbnailImageURL, id: videoID };

    cachedVideos = cachedVideos.set(video.id, video);

    return video;
}



