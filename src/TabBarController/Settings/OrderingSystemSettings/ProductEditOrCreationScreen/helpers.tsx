import { Set } from "immutable";

export interface ProductEditOrCreateValues{
    title: string;
    infoTagIds: Set<number>;
    imageSource: {uri: string, file: File} | null | undefined,
    priceString: string;
    shouldBeSoldIndividually: boolean;
    description: string;
}

