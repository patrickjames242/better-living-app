
declare module "object-encode"{
    function encode_object(object: object, algorithm?: string, salt?: string): string;
    function decode_object(string: string, algorithm?: string, salt?: string): object;
}