import { Set } from "immutable";
import { Optional, RNFileForUpload } from "../../../../../helpers/general";

export interface ProductEditOrCreateValues{
    title: string;
    infoTagIds: Set<number>;
    // if fileToUpload is null, the image will be removed on the server. if fileToUpload is undefined, the current image will be left as is.
    imageSource: {uriToDisplayInForm?: string, fileToUpload?: RNFileForUpload | null | undefined},
    priceString: string;
    shouldBeSoldIndividually: boolean;
    description: string;
}

