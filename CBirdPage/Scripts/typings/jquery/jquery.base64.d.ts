
interface Base64 {
    encode(plain: string, utf8encode: boolean): string;
    decode(codeed: string, utf8decode: boolean): string;
}

interface JQueryStatic {
    base64: Base64;
}